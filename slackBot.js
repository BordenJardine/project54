const SlackBot = require('slackbots')
const SIMULATOR_CHANNEL = 'C010F3MPB2Q'

module.exports = function createSlackBot(config, username, responseGenerator) {
  const bot = new SlackBot(config)
  let lastSender = ''
	bot.on('message', event => {

    if(event.type == 'error' && event.error.msg == 'Socket URL has expired') {
      console.log('lost connection :( restarting!')
      return createSlackBot(config, username, responseGenerator)
    }

    if (event.channel == SIMULATOR_CHANNEL) {
      lastSender = event.username
      // don't double post
      if(username == lastSender) return
      // conversations need to end some time
      if(Math.random() > 0.9) return
    }
    if(event.type != 'message') return

		if(
      // don't talk to yourself
      event.username == username ||
      event.hidden
    ) return

		console.log(event)

		bot.postMessage(
			event.channel,
			responseGenerator(event.text)
		)
	})
}
