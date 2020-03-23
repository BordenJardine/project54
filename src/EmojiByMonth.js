import React from 'react'
import Emoji, { toArray } from "react-emoji-render"
import livvyIcon from "./livvy_icon.png"
import mattIcon from "./matt_icon.jpg"
import nfLogo from "./nflogo.jpg"

const livvy = "Olivia Ruiz-Knott"
const matt = "Matt Jardine"

export default function EmojiByMonth(props) {
  const data = props.data
  
  function months() {
    return Object.keys(data).map(month => {
      return <Month title={month} data={data[month]} key={month} />
    })
  }

  return (
    <div className="monthsContainer">
      <Header />
      {months()}
      <Footer />
    </div>
  )
}

function Header(props) {
  return(
    <div className="header">
      <img src={livvyIcon} className="rounded" />
      <img src={nfLogo} />
      <img src={mattIcon} className="rounded" />
    </div>
  )
}

function Month(props) {
  return (
    <div className="month">
      <EmojiList list={props.data[livvy]} justify="right" />
      <div className="date"><h3>{props.title}</h3></div>
      <EmojiList list={props.data[matt]} justify="left" />
    </div>
  )
}

function EmojiList(props) {
  const list = props.list
  const skinTone = ':skin-tone'

  function invalid(text) {
    //get rid of the emojis we can't render
   return toArray(text).some(asEmoji => {
     return asEmoji &&
       typeof asEmoji == 'string' &&
       asEmoji.includes(':') &&
       !asEmoji.includes('noteflight')
    })
  }

  function renderEmoji(text, i) {
    //don't write out the skin tones
    if(text.startsWith(skinTone)) return null

    //concat the skin tones in with the previous emoji
    const next = list[i+1]
    if(next && next.startsWith(skinTone)) text = text.concat(next)

    if(invalid(text)) return null
    return <Emoji text={text} key={i} />
  }

  let className = "emojiList"
  if(props.justify == "right") className += ' right'
  return (
    <div className="emojiListContainer">
      <div className={className}>
      { list.map(renderEmoji)}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="footer">
      <Emoji text=":wave:" />
    </div>
  )
}
