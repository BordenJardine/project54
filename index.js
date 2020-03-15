const express = require('express');
const Intelligo = require('intelligo');
const config = require('config');

const app = express();

const oliviatthew = new Intelligo.SlackBot({
  token: "xoxb-990027139079-1003470779798-VEB97bUYbsY3ey8CXCk7SMeY",
  name: "oliviatthew"
});


//Subscribe to messages sent by the user with the bot.on() method.
oliviatthew.on('message', event => {
  if(event.type != 'message' || event.username == "oliviatthew") return

  console.log(event)
	oliviatthew.postMessage(
		event.channel,
		`:zap: hello world`
	);
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function() {
  console.log('Server is running on port', app.get('port'));
});
