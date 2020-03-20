const SlackBot = require('slackbots')

module.exports = function createSlackBot(config, username, responseGenerator) {
  const bot = new SlackBot(config)
	bot.on('message', event => {

    if(event.type == 'error' && event.error.msg == 'Socket URL has expired') {
      console.log('lost connection :( restarting!')
      return createSlackBot(config, username, responseGenerator)
    }

		if(
      event.type != 'message' ||
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
