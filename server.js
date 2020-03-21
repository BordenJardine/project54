const express = require('express')
const load = require('./markovLoader.js')
const config = require('./config.js')
const createMarkovBot = require('./markovBot2.js')
const createSlackBot = require('./slackBot.js')

const MAX_MESSAGE_LENGTH = 300
const SLACK_USERS = {
  m_477: "Matt Jardine",
  o_54: "Olivia Ruiz-Knott",
  oliviatthew: "both",
}

const app = express()

load(MAX_MESSAGE_LENGTH)
  .then(createMarkovBots)
  .then(startServer)

async function createMarkovBots(lists) {
  for(username in SLACK_USERS) {
    console.log('creating', username)
    let realName = SLACK_USERS[username]
    let responseGenerator = createMarkovBot(lists[realName])
    let slackName = username.replace('_', '-')
    createSlackBot(config[username], slackName, responseGenerator)
  }
}

function startServer() {
	app.set('port', process.env.PORT || 5000)

	app.listen(app.get('port'), () => {
		console.log('Server is running on port', app.get('port'))
	})
}
