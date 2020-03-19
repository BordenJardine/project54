const express = require('express')
const SlackBot = require('slackbots')
const load = require('./markovLoader.js')
const config = require('./config.js')
const createMarkovBot = require('./markovBot.js')

const MAX_MESSAGE_LENGTH = 300;
const brainPath = 'data/oliviatthew'

const app = express()
const oliviatthewBot = new SlackBot(config.oliviatthew)

load(MAX_MESSAGE_LENGTH)
  .then(createBot)
  .then(startBot)
  .then(startServer)

function createBot(lists) {
	return createMarkovBot(lists['Olivia Ruiz-Knott'].join('\n'))
}

function startBot(responder) {
	oliviatthewBot.on('message', event => {
		if(event.type != 'message' ||
       event.username == "oliviatthew" || event.hidden) return

		console.log(event)
		oliviatthewBot.postMessage(
			event.channel,
			responder(event.text)
		);
	});
}

function startServer() {
	app.set('port', process.env.PORT || 5000)

	app.listen(app.get('port'), () => {
		console.log('Server is running on port', app.get('port'))
	});
}
