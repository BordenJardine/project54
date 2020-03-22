const SlackBot = require('slackbots')
const SIMULATOR_CHANNEL = 'C010F3MPB2Q'

module.exports = function createSlackBot(config, user, responseGenerator) {
  const bot = new SlackBot(config)
  let lastSender = null
	bot.on('message', event => {

    if(event.type == 'error' && event.error.msg == 'Socket URL has expired') {
      console.log('lost connection :( restarting!')
      return createSlackBot(config, user, responseGenerator)
    }

    if(event.type != 'message' || event.hidden) return
    // don't talk to yourself
		if(event.user == user) return

    if(event.channel == SIMULATOR_CHANNEL) {
      // don't double post
      if(user == lastSender) {
         lastSender = null
         return
      }
      lastSender = event.user

      // conversations need to end some time
      if(Math.random() > 0.8) return
    }

		console.log(event)

		bot.postMessage(
			event.channel,
			responseGenerator(event.text),
      {as_user: true}
		)
	})
}
