const Markov = require('markov-generator')
const MIN = 1

module.exports = function createBot(text) {
  const bot = new Markov({
    input: text,
    minLength: Math.floor(Math.random() * 30) + MIN
  })
  return respondTo = (line) => {
    return bot.makeChain()
  }
}
