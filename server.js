const express = require('express')
const load = require('./markovLoader.js')
const config = require('./config.js')
const createMarkovBot = require('./markovBot.js')
const createSlackBot = require('./slackBot.js')

const MAX_MESSAGE_LENGTH = 300
const SLACK_USERS = {
  U010DAFUAEQ: "Matt Jardine",
  U0103N3D4F3: "Olivia Ruiz-Knott",
  U0103DUNXPG: "both"
}

const app = express()

load(MAX_MESSAGE_LENGTH)
  .then(createMarkovBots)
  .then(startServer)

async function createMarkovBots(lists) {
  for(user in SLACK_USERS) {
    let realName = SLACK_USERS[user]
    console.log('creating', realName)
    let responseGenerator = createMarkovBot(lists[realName])
    let slackName = user.replace('_', '-')
    createSlackBot(config[user], slackName, responseGenerator)
  }
}

function startServer() {
	app.set('port', process.env.PORT || 5000)

	app.listen(app.get('port'), () => {
		console.log('Server is running on port', app.get('port'))
	})
}
