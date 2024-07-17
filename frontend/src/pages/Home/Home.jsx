import React, { useState, useEffect, useRef } from 'react'
import emoji from '../../assets/emoji.png'
import EmojiPicker from 'emoji-picker-react';
import Message from '../../components/Message/Message'
import Profile from '../../components/Profile/Profile'
import ExploredUser from '../../components/ExploredUser/ExploredUser'
import image1 from '../../assets/naruto.jpeg'
import image2 from '../../assets/Kakashi.webp'
import { colorEmojiList } from '../../assets/assets.js'
import './Home.css'
const Home = () => {
  const [message, setMessage] = useState('')
  const [emojiPicker, setEmojiPicker] = useState(false)
  const [displayedEmoji, setDisplayedEmoji] = useState({ index: 0, emoji: colorEmojiList[0], focus: false })
  const inputRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    const cursorPosition = inputRef.current.selectionStart;
    setMessage((prevInput) => prevInput.slice(0, cursorPosition) + emojiObject.emoji + prevInput.slice(cursorPosition));

    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(cursorPosition + emojiObject.emoji.length, cursorPosition + emojiObject.emoji.length);
    }, 0);
  };

  const toggleEmojiPicker = () => {
    setEmojiPicker(!emojiPicker);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isArabic = (text) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  };

  const emojiOnMouseEnter = (e) => {
    const length = colorEmojiList.length;
    const newIndex = (displayedEmoji.index + 1) % length
    setDisplayedEmoji({
      index: newIndex,
      emoji: colorEmojiList[newIndex],
      focus: true
    })
  }
  const emojiOnMouseLeave = (e) => {
    setDisplayedEmoji((prev) => {
      return {
        ...prev,
        focus: false
      }
    })
  }

  useEffect(() => {
    // console.log(message)
  })


  return (
    <div style={{
      display: 'flex'
    }}>
      <div className="explore-container">
        <ExploredUser></ExploredUser>
        <ExploredUser></ExploredUser>
        <ExploredUser></ExploredUser>
        <ExploredUser></ExploredUser>
      </div>
      <div className="chat-container">

        <div className='messages-container'>
          <Message className='my-message' data={{
            sender: 'shady',
            date: 'Today 15.30 AM',
            text: 'السلام عليكم و رحمة الله و بركاته',
            image: image1,
            myMessage: true
          }}>
          </Message>
          <Message className='his-message' data={{
            sender: 'shady',
            date: 'Today 15.30 AM',
            text: 'السلام عليكم و رحمة الله و بركاته',
            image: image2,
            myMessage: false
          }}>
          </Message>
          <Message className='my-message' data={{
            sender: 'shady',
            date: 'Today 15.30 AM',
            text: 'Hello world!, My name is Shady. What is yours 😅?',
            image: image1,
            myMessage: true
          }}>
          </Message>
          <Message className='his-message' data={{
            sender: 'shady',
            date: 'Today 15.30 AM',
            text: 'Hello world!, My name is Shady. What is yours?',
            image: image2,
            myMessage: false
          }}>
          </Message>
          <Message className='my-message' data={{
            sender: 'shady',
            date: 'Today 15.30 AM',
            text: 'Hello world!, My name is Shady. What is yours?',
            image: image1,
            myMessage: true
          }}>


          </Message>
          <Message className='his-message' data={{
            sender: 'shady',
            date: 'Today 15.30 AM',
            text: 'Hello world!, My name is Shady. What is yours?',
            image: image2,
            myMessage: false
          }}>
          </Message>
        </div>

        <div className="input-container">
          <input
            className={isArabic(message) ? 'text-input-rtl text-container' : 'text-container'}
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <img src={displayedEmoji.emoji}
            alt="emoji"
            className={displayedEmoji.focus ? "emoji-icon" : "emoji-icon emoji-icon-leave"}
            onClick={toggleEmojiPicker}
            onMouseEnter={emojiOnMouseEnter}
            onMouseLeave={emojiOnMouseLeave}
          ></img>
          <div className='emoji-picker'>
            <EmojiPicker
              open={emojiPicker}
              autoFocusSearch={false}
              theme={'dark'}
              emojiStyle={'facebook'}
              onEmojiClick={handleEmojiClick}
            />
          </div>
        </div>

      </div>
      <div className='friends-container'>

      </div>
    </div >
  )
}

export default Home