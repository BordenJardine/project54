const Fs = require('fs');
const CsvReadableStream = require('csv-reader');

module.exports = async function readChatCSV(filePath, onEachRow) {
  const inputStream = Fs.createReadStream(filePath, 'utf8')
  return new Promise(resolve => {
    inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', (row) => {
      onEachRow({
        when: row[1],
        who: row[3],
        message: clean(row[4])
      })
    })
    .on('end', data => {
      resolve()
    })
  })
}

function clean(message) {
  if (typeof message != 'string') return null
    return message
      .replace(/`.*`/g, '')
      //.replace(/\[.*\)/g, '')
}
