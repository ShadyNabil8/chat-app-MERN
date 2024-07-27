import { React, useState, useRef, useEffect } from 'react'
import Message from '../../components/Message/Message'
import { colorEmojiList, testMessages } from '../../assets/assets.js'
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../context/authContext';
import { useMessages } from '../../context/messagesContext.jsx';
import { getFormattedDate } from '../../utils/date.js'

import './Conversation.css'

const Conversation = () => {
    const { messages, selectedChat } = useMessages();

    const { authState } = useAuth();
    const userData = authState.userData;

    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([]);
    const [emojiPicker, setEmojiPicker] = useState(false)
    const [displayedEmoji, setDisplayedEmoji] = useState({ index: 0, emoji: colorEmojiList[0], focus: false })
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    
    useEffect(() => {
        console.log(messageList);
        setMessageList(selectedChat ? messages[selectedChat] : [])
    }, [selectedChat])

    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };

    const toggleEmojiPicker = () => {
        setEmojiPicker(!emojiPicker);
        if (inputRef.current) {
            inputRef.current.focus();
        }
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

    const handleEmojiClick = (emojiObject) => {
        const cursorPosition = inputRef.current.selectionStart;
        setMessage((prevInput) => prevInput.slice(0, cursorPosition) + emojiObject.emoji + prevInput.slice(cursorPosition));

        setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(cursorPosition + emojiObject.emoji.length, cursorPosition + emojiObject.emoji.length);
        }, 0);
    };

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
    return (
        <div className="conversation-container">
            <div className='conversation' ref={scrollRef} >
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
    )
}

export default Conversation
