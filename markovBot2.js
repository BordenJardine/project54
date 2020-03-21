const Markov = require('markov-generator')
const MIN = 20

module.exports = function createBot(text) {
  const bot = new Markov({
    input: text,
    minLength: MIN
  })
  return respondTo = (line) => {
    return bot.makeChain()
  }
}
