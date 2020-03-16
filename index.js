const express = require('express');
const SlackBot = require('slackbots');
const load = require('./loader.js');
const config = require('./config.js');
const RNNTest = require('./brain.js').RNNTest;

const app = express();

const oliviatthew = new SlackBot(config.oliviatthew);

const brainPath = 'data/oliviatthew'
let	oliviatthewBrain

load()
  .then(createBrain)
  //.then(trainBrain)
  .then(loadBrain)
  .then(saveBrain)
  .then(startBot)
  .then(startServer)


function createBrain(material) {
	oliviatthewBrain = new RNNTest(
		material.list,
		material.charList,
		material.longest
	)
}

function trainBrain() {
	oliviatthewBrain.generate()
	return oliviatthewBrain.train(1, 128)
}

function saveBrain() {
	return oliviatthewBrain.save(brainPath)
}

function loadBrain() {
	return oliviatthewBrain.load(brainPath)
}

function startBot() {
	oliviatthew.on('message', event => {
		if(event.type != 'message' || event.username == "oliviatthew") return

		console.log(event)
		oliviatthew.postMessage(
			event.channel,
			oliviatthewBrain.answer(event.text)
		);
	});
}

function startServer() {
	app.set('port', process.env.PORT || 5000);

	app.listen(app.get('port'), function() {
		console.log('Server is running on port', app.get('port'));
	});
}
