import React, { useState, useEffect, useRef } from 'react'
import EmojiPicker from 'emoji-picker-react';
import Message from '../../components/Message/Message'
import Profile from '../../components/Profile/Profile'
import Explore from '../../components/Explore/Explore'
import Friend from '../../components/Friend/Friend'
import Header from '../../components/Header/Header'
import image1 from '../../assets/naruto.jpeg'
import { colorEmojiList, testMessages } from '../../assets/assets.js'
import { useAuth } from '../../context/authContext';
import { getFormattedDate } from '../../utils/date.js'
import api from '../../api/api.jsx'

import './Home.css'

const Home = () => {
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState(testMessages);
  const [emojiPicker, setEmojiPicker] = useState(false)
  const [displayedEmoji, setDisplayedEmoji] = useState({ index: 0, emoji: colorEmojiList[0], focus: false })
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const { authState, setAuthState } = useAuth();

  const userData = authState.userData;


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
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setMessageList((prevMessageList) => {
        return [
          ...prevMessageList,
          {
            sender: userData.displayedName,
            image: userData.profilePicture,
            date: getFormattedDate(),
            text: message,
            myMessage: true
          }
        ]
      })
      setMessage('');

      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    else if (event.key === 'Escape') {
      setEmojiPicker(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('user/profile');
        const { displayedName, email, profilePicture, friends } = response.data.data;

        setAuthState({
          isAuthenticated: true,
          userData: {
            displayedName: displayedName,
            email: email,
            profilePicture: profilePicture,
            friends: friends
          }
        });

      } catch (error) {
        console.log(error);
        setAuthState({
          isAuthenticated: false,
          userData: {
            displayedName: '',
            email: '',
            profilePicture: '',
            friends: []
          }
        });

      }
    }

    if (!authState.isAuthenticated) {
      fetchProfile();
    }

  }, [] /* [setUserData] */);

  

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      height: '100vh',
      gap: '20px',
      backgroundColor: '#2B2D31'
    }}>

      <Header userData={userData}>
      </Header>

      <div style={{
        display: 'flex',
        flex: '1',
        maxHeight: '100%',
        boxSizing: 'border-box'
      }}>
        {/* <Profile></Profile> */}
        <Explore></Explore>

        <div className="chat-container">
          <div className='messages-container' ref={scrollRef} >
            {messageList.map((message, index) => <Message key={index} data={message}></Message>)}
          </div>
          <div className="input-container">
            <input
              className={isArabic(message) ? 'text-input-rtl text-container' : 'text-container'}
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
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
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "السﻻم عليكم السﻻم عليكم السﻻم عليكم السﻻم" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
          <Friend data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?" }}></Friend>
        </div>
      </div >
    </div>
  )
}

export default Home