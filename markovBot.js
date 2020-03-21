const markov = require('markov')
const ORDER = 2

module.exports = function createBot(text) {
  const bot = markov(ORDER)
  const respondTo = (line) => {
    const response = bot.respond(line, 300).join(' ')
    console.log('response length', response.length)
    return response.substring(0, response.indexOf('.', 3) + 1)
  }
  const t = Date.now()
  return new Promise((resolve, reject) => {
    console.log('starting seed')
    bot.seed(text, () => {
      // promise to resolve with a function that responds intelligently(?) to text
      console.log('done seeding took', (Date.now() - t) / 1000, 'seconds')
      resolve(respondTo)
    })
  })
}
