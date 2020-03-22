import React, { useState, useEffect } from 'react'
import EmojiByMonth from './EmojiByMonth.js'

export default function App() {
  const [data, setData] = useState()

  // gem dem emojis
  useEffect(() => {
    fetch('/emoji-use')
    .then(response => response.json())
    .then(setData)
  }, [])

  if(!data) return null
  return (
    <div className="App">
			<EmojiByMonth data={data} />
    </div>
  )
}

