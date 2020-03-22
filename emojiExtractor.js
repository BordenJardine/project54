const readChatCSV = require('./csvReader.js')

/*
[
  Jun 2017': {
    livvy: [
    ],
    matt: [
    ]
  }
]
}
*/

module.exports = async function emojiExtractor(filePath) {
  const months = {}
  let counts = {}

  function log() {
    console.log('Months:', Object.keys(months).length)
    for(let who in counts) console.log(counts[who])
  }

  function readRow(row) {
    const {when, who, message} = row
    
    const date = when.split(' ')
    const month = `${date[1]} ${date[3]}`
    if(!message) return 
    const emojis = Array.from(message.match(/:[a-zA-Z_\-0-9]*:/g) || [])
    if(!months[month]) months[month] = {}
    if(!months[month][who]) months[month][who] = []
    months[month][who] = months[month][who].concat(emojis)

    if(!counts[who]) counts[who] = 0
    counts[who] += emojis.length
  }

  await readChatCSV(filePath, readRow)
  log()
  return months
}
