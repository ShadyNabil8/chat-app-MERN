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

const Conversation = ({ fetchChats }) => {
    // console.log("------------> Conversation");

    const { selectedChatData } = useGlobalState();

    const [messages, setMessages] = useState(testMessages);

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

    useSocketEvent('private-message', (data, callback) => {
        console.log(data);
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
        const cursorPosition = inputRef.current.selectionStart;
        const messageWithEmoji = curMessage.slice(0, cursorPosition) + emojiObject.emoji + curMessage.slice(cursorPosition);
        setCurMessageObj((prev) => {
            return {
                ...prev,
                [selectedChatData.chatId]: messageWithEmoji,
            }
        })
        setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(cursorPosition + emojiObject.emoji.length, cursorPosition + emojiObject.emoji.length);
        }, 0);
    };

    const sendMessage = () => {
        if (curMessage) {
            const newMessage = {
                sender: userData.displayedName,
                image: userData.profilePicture,
                date: getFormattedDate(),
                text: curMessage,
                myMessage: true
            }
            setMessages((prev) => {
                return {
                    ...prev,
                    [selectedChatData.chatId]: [...(prev[selectedChatData.chatId] || []), newMessage]
                }
            })
            emitEvent('private-message', {
                senderId: userData.userId,
                message: newMessage.text,
                receiverId: selectedChatData.receiverId,
            }, (response) => {
                if (response.status === 'GYM') { // Got Your Message
                    console.log(response.message);

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

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            if (selectedChatData.chatType === 'new-chat') {
                const response = await api.post(chatRoute.create, {
                    receiverId: selectedChatData.receiverId,
                    body: curMessage,
                })
                const { createdChatId, lastMeaagse } = response.data.data;

                fetchChats();
            }
            sendMessage();
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