const Fs = require('fs');
const CsvReadableStream = require('csv-reader');

function clean(message) {
	if (typeof message != 'string') return null
	message = message
    .replace(/`.*`/g, '')
    .replace(/\[.*\)/g, '')

  // i'm using periods to limit the length, so make sure they are there.
  if (!['?','.','!'].includes(message.charAt(message.length-1))) {
    message = message.concat('.')
  }
  return message
}

module.exports = function load(maxLen) {
	const inputStream = Fs.createReadStream('data/livvy_chat.txt', 'utf8')
  const lists = {
    'Olivia Ruiz-Knott': [],
    'Matt Jardine': [],
    'both': []
  }
	let skipped = 0

  function log() {
    for (name in lists) console.log(name, lists[name].length)
    console.log('Skipped:', skipped)
  }

  function readRow(row) {
    const who = row[3]
    const message = clean(row[4])
    if (!message || message.length > maxLen) {
      skipped++
      return
    }
    for (name in lists) {
      if (name == who || name == 'both') {
        lists[name].push(message)
      }
    }
  }

	return new Promise((resolve, reject) => {
		inputStream
			.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
			.on('data', readRow)
			.on('end', data => {
          log()
					resolve(lists)
			})
	})
}
