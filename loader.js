const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
let prev = ''
let list = []
let chars = new Set()
let longest = 0
let longestM = ''
let skipped = 0
let max = 100

function readRow(row) {
	const who = row[3]
	const message = clean(row[4])
	if(typeof message != 'string') return

  if (message.length > max) {
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

module.exports = function load(maxLen) {
	let inputStream = Fs.createReadStream('data/livvy_chat.txt', 'utf8');
	prev = ''
	list = []
	chars = new Set()
	longest = 0
	longestM = ''
	skipped = 0
	max = maxLen
	 
	return new Promise((resolve, reject) => {

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
