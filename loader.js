const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const MAX_LEN = 100
let prev = ''
let list = []
let chars = new Set()
let longest = 0
let longestM = ''
let skipped = 0

function readRow(row) {
	const who = row[3]
	const message = clean(row[4])
	if(typeof message != 'string') return

  if (message.length > MAX_LEN) {
    skipped++
    return
  }

	message.split('').forEach(c => {
		chars.add(c)
	})

	if(message.length > longest) {
		longest = message.length
		longestM = message
	}
	
	list.push([prev, message])
	prev = message
}

function clean(message) {
	if(typeof message != 'string') return
	return message
  .replace(/`.*`/g, '')
  .replace(/\[.*\)/g, '')
}

module.exports = function load() {
	let inputStream = Fs.createReadStream('data/livvy_chat.txt', 'utf8');
	 
	return new Promise((resolve, reject) => {
		prev = ''
		list = []
		chars = new Set()
		longest = 0
		longestM = ''
    skipped = 0

		inputStream
			.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
			.on('data', readRow)
			.on('end', function (data) {
					const charList = Array.from(chars).join('')
					console.log('loaded', list.length, 'messages. Longest:', longest, 'Chars:', charList.length, 'Skipped:', skipped)
					resolve({list, charList, longest})
			});
	})
}
