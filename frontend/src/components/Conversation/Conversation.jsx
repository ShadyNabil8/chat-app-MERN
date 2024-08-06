import { React, useState, useRef, useEffect } from 'react'
import Message from '../../components/Message/Message'
import { colorEmojiList } from '../../assets/assets.js'
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../context/authContext';
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import { IoSend } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import { PiMicrophone } from "react-icons/pi";
import { useSocket } from '../../context/SocketContext.jsx'
import useSocketEvent from '../../hooks/useSocket.js'
import api from '../../api/api.jsx'
import { chatRoute } from '../../routes/routes.js'
import moment from 'moment';

import './Conversation.css'

const Conversation = () => {
    // console.log("------------> Conversation");

    const {
        selectedChatData,
        setSelectedChatData,
        setChats,
        messages,
        setMessages
    } = useGlobalState();


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


    // This function adds a message to a its chat message container.
    const addMessage = (payload) => {
        const newMessage = {
            body: payload.body,
            myMessage: payload.myMessage,
            received: payload.received,
            senderProfilePicture: payload.senderProfilePicture,
            sentAt: payload.sentAt
        }

        setMessages((prev) => {
            return {
                ...prev,
                [payload.chatId]: [...(prev[payload.chatId] || []), newMessage]
            }
        })
    }
    // This function shoe last message on chat.
    const updateChat = (payload) => {
        setChats((prev) => {
            return prev.map((chat) => {
                return (chat.chatId === payload.chatId)
                    ? { ...chat, lastMessage: payload.body, lastMessageDate: moment(payload.sentAt).format('LT') }
                    : chat
            })
        })
    }

    useSocketEvent('private-message', (payload, callback) => {
        payload.myMessage = false;
        addMessage(payload);
        updateChat(payload);
        callback({ status: 'received' });
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

    const sendMessage = (payload) => {
        if (curMessage) {
            emitEvent('private-message', payload, ({ status }) => {
                if (status === 'received') {
                    payload['received'] = true;
                }
                else if (status === 'not-received') {
                    payload['received'] = false;
                }
                addMessage({
                    ...payload,
                    myMessage: true,
                });
                updateChat(payload);
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
            if (selectedChatData.chatType === 'existed-chat') {
                const payload = {
                    senderId: userData.userId,
                    senderProfilePicture: selectedChatData.profilePicture,
                    receiverId: selectedChatData.receiverId,
                    body: curMessageObj[selectedChatData.chatId],
                    chatId: selectedChatData.chatId,
                    sentAt: new Date(),
                }
                sendMessage(payload);
            }
            else if (selectedChatData.chatType === 'new-chat') {
                try {
                    const response = await api.post(chatRoute.create, {
                        receiverId: selectedChatData.receiverId,
                        body: curMessage,
                    })

                    const { chatId, receiverRecord, lastMessageRecord } = response.data.data

                    const payload = {
                        senderId: userData.userId,
                        senderProfilePicture: selectedChatData.profilePicture,
                        receiverId: selectedChatData.receiverId,
                        body: curMessageObj[selectedChatData.chatId],
                        sentAt: new Date(),
                        chatId,
                    }

                    sendMessage(payload);

                    const newChat = {
                        chatType: 'existed-chat',
                        chatId,
                        receiverId: receiverRecord._id,
                        displayedName: receiverRecord.displayedName,
                        profilePicture: receiverRecord.profilePicture,
                        lastMessage: lastMessageRecord.body,
                        lastMessageDate: moment(lastMessageRecord.sentAt).format('LT')
                    }
                    setChats((prev) => [newChat, ...prev])

                    setSelectedChatData({
                        chatType: newChat.chatType,
                        chatId,
                        receiverId: receiverRecord._id,
                        displayedName: receiverRecord.displayedName,
                        profilePicture: receiverRecord.profilePicture,
                    })
                } catch (error) {
                    console.log(error);
                    
                }


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
    }, [messages])

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