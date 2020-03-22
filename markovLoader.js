const readChatCSV = require('./csvReader.js')

module.exports = async function load(filePath, maxLen) {
  const lists = {
    'Olivia Ruiz-Knott': [],
    'Matt Jardine': [],
    'both': []
  }
	let skipped = 0

  function log() {
    for (let name in lists) console.log(name, lists[name].length)
    console.log('Skipped:', skipped)
  }

  function readRow(row) {
    const {who, message} = row
    if (!message || message.length > maxLen) {
      skipped++
      return
    }
    for (let name in lists) {
      if (name == who || name == 'both') {
        lists[name].push(message)
      }
    }
  }

  await readChatCSV(filePath, readRow)
  log()
  return lists
}
