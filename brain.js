// can't use GPU in windows subsystem, seems like
const tf = require('@tensorflow/tfjs-node');
const LAYERS = 1


class CharacterTable {
  /**
   * Constructor of CharacterTable.
   * @param chars A string that contains the characters that can appear
   *   in the input.
   */
  constructor(chars) {
    this.chars = chars;
    this.charIndices = {};
    this.indicesChar = {};
    this.size = this.chars.length;
    for (let i = 0; i < this.size; ++i) {
      const char = this.chars[i];
      if (this.charIndices[char] != null) {
        throw new Error(`Duplicate character '${char}'`);
      }
      this.charIndices[this.chars[i]] = i;
      this.indicesChar[i] = this.chars[i];
    }
  }

  /**
   * Convert a string into a one-hot encoded tensor.
   *
   * @param str The input string.
   * @param numRows Number of rows of the output tensor.
   * @returns The one-hot encoded 2D tensor.
   * @throws If `str` contains any characters outside the `CharacterTable`'s
   *   vocabulary.
   */
  encode(str, numRows) {
    const buf = tf.buffer([numRows, this.size]);
    for (let i = 0; i < str.length; ++i) {
      const char = str[i];
      if (this.charIndices[char] == null) {
        throw new Error(`Unknown character: '${char}'`);
      }
      buf.set(1, i, this.charIndices[char]);
    }
    return buf.toTensor().as2D(numRows, this.size);
  }

  encodeBatch(strings, numRows) {
    const numExamples = strings.length;
    const buf = tf.buffer([numExamples, numRows, this.size]);
    for (let n = 0; n < numExamples; ++n) {
      const str = strings[n];
      for (let i = 0; i < str.length; ++i) {
        const char = str[i];
        if (this.charIndices[char] == null) {
          throw new Error(`Unknown character: '${char}'`);
        }
        buf.set(1, n, i, this.charIndices[char]);
      }
    }
    return buf.toTensor().as3D(numExamples, numRows, this.size);
  }

  /**
   * Convert a 2D tensor into a string with the CharacterTable's vocabulary.
   *
   * @param x Input 2D tensor.
   * @param calcArgmax Whether to perform `argMax` operation on `x` before
   *   indexing into the `CharacterTable`'s vocabulary.
   * @returns The decoded string.
   */
  decode(x, calcArgmax = true) {
    return tf.tidy(() => {
      if (calcArgmax) {
        x = x.argMax(1);
      }
      const xData = x.dataSync();  // TODO(cais): Performance implication?
      let output = '';
      for (const index of Array.from(xData)) {
        output += this.indicesChar[index];
      }
      return output;
    });
  }
}

function convertDataToTensors(data, charTable, maxLen) {
  const questions = data.map(datum => datum[0]);
  const answers = data.map(datum => datum[1]);
  return [
    charTable.encodeBatch(questions, maxLen),
    charTable.encodeBatch(answers, maxLen),
  ];
}

function createAndCompileModel(layers, hiddenSize, maxLen, vocabularySize) {
  const model = tf.sequential();
  console.log('maxlen!', maxLen)
  model.add(tf.layers.simpleRNN({
    units: hiddenSize,
    recurrentInitializer: 'glorotNormal',
    inputShape: [maxLen, vocabularySize]
  }));
  model.add(tf.layers.repeatVector({n: maxLen}));
	model.add(tf.layers.simpleRNN({
		units: hiddenSize,
		recurrentInitializer: 'glorotNormal',
		returnSequences: true
	}));
   
  model.add(tf.layers.timeDistributed({
    layer: tf.layers.dense({units: vocabularySize})
	}));
  model.add(tf.layers.activation({activation: 'softmax'}));
  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: 'adam',
    metrics: ['accuracy']
  });
  return model;
}


class RNNTest {
	constructor(data, chars, maxLen) {
		this.data = data;
		this.chars = chars;
		this.maxLen = maxLen;
    this.charTable = new CharacterTable(chars);
	}

  generate(layers=LAYERS, hiddenSize=128) {
    // Prepare training data.
    const split = Math.floor(this.data.length * 0.9);
    this.trainData = this.data.slice(0, split);
    this.testData = this.data.slice(split);
    [this.trainXs, this.trainYs] =
        convertDataToTensors(this.trainData, this.charTable, this.maxLen);
    [this.testXs, this.testYs] =
        convertDataToTensors(this.testData, this.charTable, this.maxLen);
    this.model = createAndCompileModel(layers, hiddenSize, this.maxLen, this.chars.length);
  }

  async train(iterations, batchSize) {
    for (let i = 0; i < iterations; ++i) {
      console.log(`training ${i}/${iterations}`)
      await this.model.fit(this.trainXs, this.trainYs, {
        epochs: 1,
        batchSize,
        validationData: [this.testXs, this.testYs],
        yieldEvery: 'epoch'
      });
    }
  }

  answer(input) {
		console.log(input)
    const inTensor = this.charTable.encode(input, this.maxLen)
    const outTensor = this.model.predict(inTensor.as3D(1, this.maxLen, this.chars.length))
    return this.charTable.decode(outTensor.as2D(outTensor.shape[1], outTensor.shape[2]))
  }

	async save(path) {
		await this.model.save(`file://${path}`);
	}

	async load(path) {
		this.model = await tf.loadLayersModel(`file://${path}/model.json`);
	}
}

exports.RNNTest = RNNTest
