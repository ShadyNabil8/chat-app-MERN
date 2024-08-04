import { React, useState, useRef, useEffect } from 'react'
import Message from '../../components/Message/Message'
import { colorEmojiList, testMessages } from '../../assets/assets.js'
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../context/authContext';
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import { getFormattedDate } from '../../utils/date.js'
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import { PiMicrophone } from "react-icons/pi";
import { useSocket } from '../../context/SocketContext.jsx'
import useSocketEvent from '../../hooks/useSocket.js'
import api from '../../api/api.jsx'
import { chatRoute } from '../../routes/routes.js'

import './Conversation.css'

const Conversation = () => {
    // console.log("------------> Conversation");

    const { selectedChatData, setSelectedChatData,fetchChats } = useGlobalState();

    const [messages, setMessages] = useState({});

    const { authState } = useAuth();
    const userData = authState.userData;

    const { emitEvent } = useSocket();

    const [curMessageObj, setCurMessageObj] = useState({})
    const [emojiPicker, setEmojiPicker] = useState(false)
    const [displayedEmoji, setDisplayedEmoji] = useState({ index: 0, emoji: colorEmojiList[0], focus: false })
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    const messageList = selectedChatData.chatId ? messages[selectedChatData.chatId] ? messages[selectedChatData.chatId] : [] : [];
    const curMessage = selectedChatData.chatId ? curMessageObj[selectedChatData.chatId] ? curMessageObj[selectedChatData.chatId] : '' : ''
    console.log(`Cur msg: ${curMessage}`);
    
    useSocketEvent('private-message', (payload, callback) => {
        payload.myMessage = false;
        setMessages((prev) => {
            return {
                ...prev,
                [payload.chatId]: [...(prev[payload.chatId] || []), payload]
            }
        })
        callback('GYM'); // Got Your Message
    })

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
        console.log(emojiObject.emoji);
        
        const cursorPosition = inputRef.current.selectionStart;
        setCurMessageObj((prev) => {
            const typingMessage = prev[selectedChatData.chatId] || ''
            return {
                ...prev,
                [selectedChatData.chatId]: typingMessage.slice(0, cursorPosition) + emojiObject.emoji + typingMessage.slice(cursorPosition),
            }
        })
        setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(cursorPosition + emojiObject.emoji.length, cursorPosition + emojiObject.emoji.length);
        }, 0);
    };

    const sendMessage = () => {
        if (curMessage) {

            emitEvent('private-message', {
                senderId: userData.userId,
                senderProfilePicture: userData.profilePicture,
                message: curMessageObj[selectedChatData.chatId],
                receiverId: selectedChatData.receiverId,
                chatId: selectedChatData.chatId
            }, ({ status, payload }) => {
                if (status === 'GYM') { // Got Your Message
                    console.log(payload);
                    payload.myMessage= true;
                    setMessages((prev) => {
                        return {
                            ...prev,
                            [payload.chatId]: [...(prev[payload.chatId] || []), payload]
                        }
                    })
                }
            });
            setCurMessageObj((prev) => {
                return {
                    ...prev,
                    [selectedChatData.chatId]: ''
                }
            })
        }
    }
    useEffect(() => {
        console.log(messages);

    }, [messages])
    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            if (selectedChatData.chatType === 'existed-chat') {
                sendMessage();

            }
            else if (selectedChatData.chatType === 'new-chat') {
                await api.post(chatRoute.create, {
                    receiverId: selectedChatData.receiverId,
                    body: curMessage,
                })
                fetchChats();
                setSelectedChatData({
                    chatType: '',
                    chatId: '',
                    image: '',
                    name: '',
                    receiverId: ''
                })
            }
        }
        else if (event.key === 'Escape') {
            setEmojiPicker(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messageList])

    return (
        <div className="conversation-display">
            {
                (selectedChatData.chatId) &&
                <div className="conversation-header">
                    <div className="info">
                        <img src={selectedChatData.profilePicture}></img>
                        <p className='name'>{selectedChatData.displayedName}</p>
                    </div>
                </div>
            }
            <div className='conversation' ref={scrollRef} >
                {messageList.map((message, index) => <Message key={index} data={message}></Message>)}
            </div>
            {
                (selectedChatData.chatId) &&
                <div className="input-container">
                    <div className="text-emoji">
                        <input
                            className={isArabic(curMessage) ? 'text-input-rtl text-container' : 'text-container'}
                            ref={inputRef}
                            type="text"
                            placeholder="Type your message..."
                            value={curMessage}
                            onChange={(e) => setCurMessageObj((prev) => {
                                return {
                                    ...prev,
                                    [selectedChatData.chatId]: e.target.value
                                }
                            })}
                            onKeyDown={handleKeyDown}>
                        </input>
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
                                searchDisabled={true}
                            />
                        </div>
                    </div>
                    <div className="action-container">
                        <div className="action-attach">
                            <MdOutlineAttachFile className='icon' />
                            <PiMicrophone className='icon' />
                        </div>
                        <div className="action-send">
                            <IoSend className='icon' onClick={() => sendMessage()} />
                        </div>
                    </div>
                </div>

            }
        </div>
    )
}

export default Conversation