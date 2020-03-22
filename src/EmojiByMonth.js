import React, { useState, useEffect } from 'react'
import Emoji from "react-emoji-render"

const livvy = "Olivia Ruiz-Knott"
const matt = "Matt Jardine"

const chatters = [
  livvy,
  matt
]

export default function EmojiByMonth(props) {
  const data = props.data
  
  return Object.keys(data).map(month => {
    return <Month title={month} data={data[month]} />
  })
}

function Month(props) {

  function renderEmojiList(name) {
    return (
      <div>
        <Emoji text={props.data[name].join('')} />
      </div>
    )
  }
  
  return (
    <div>
      <h3>{props.title}</h3>
      {chatters.map(renderEmojiList)}
    </div>
  )
}
