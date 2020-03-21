const Markov = require('markov-generator')
const MIN = 1

module.exports = function createBot(text) {
  const bot = new Markov({ input: text })
  return respondTo = (line) => {
    const min = Math.floor(Math.random() * 30) + MIN
    return bot.makeChain(min)
  }
}
