import { React, useState, useRef, useEffect, useCallback } from 'react'
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
import debounce from 'lodash.debounce';
import LoadingDots from '../../components/LoadingDots/LoadingDots'

import './Conversation.css'

const Conversation = () => {
    // console.log("------------> Conversation");

    const {
        selectedChatData,
        setSelectedChatData,
        chats,
        setChats,
        messages,
        setMessages,
        reachedTopChat,
        setReachedTopChat,
        messagesLoading,
    } = useGlobalState();


    const { authState, clearUserData } = useAuth();
    const userData = authState.userData;

    const { emitEvent } = useSocket();

    const [curMessageObj, setCurMessageObj] = useState({})
    const lastScrollHeight = useRef(0);
    const [emojiPicker, setEmojiPicker] = useState(false)
    const [displayedEmoji, setDisplayedEmoji] = useState({ index: 0, emoji: colorEmojiList[0], focus: false })
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const audioRef = useRef(null);

    const messageList = selectedChatData.chatId ? messages[selectedChatData.chatId] ? messages[selectedChatData.chatId] : [] : [];
    const curMessage = selectedChatData.chatId ? curMessageObj[selectedChatData.chatId] ? curMessageObj[selectedChatData.chatId] : '' : ''


    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

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
    const updateChat = (payload, pending) => {
        setChats((prev) => {
            return prev.map((chat) => {
                return (chat.chatId === payload.chatId)
                    ? {
                        ...chat,
                        lastMessage: payload.body,
                        lastMessageDate: moment(payload.sentAt).format('LT'),
                        pending: pending
                    }
                    : chat
            })
        })
    }

    useSocketEvent('private-message', (payload, callback) => {
        const existedChat = chats.find((chat) => chat.chatId === payload.chatId)
        if (!existedChat) {
            const newChat = {
                chatType: 'existed-chat',
                chatId: payload.chatId,
                receiverId: payload.senderId,
                displayedName: payload.displayedName,
                profilePicture: payload.senderProfilePicture,
                lastMessage: payload.body,
                lastMessageDate: moment(payload.lastMessageDate).format('LT'),
                isSelected: true,
                pending: 1,
                fetchMgs: true
            }
            setChats((prev) => [...prev, newChat])
        }
        else {
            const pending = (selectedChatData.chatId === payload.chatId)
                ? 0
                : chats.find((chat) => chat.chatId === payload.chatId).pending + 1
            console.log(pending);
            updateChat(payload, pending);
            payload.myMessage = false;
            if (existedChat.isSelected) {
                addMessage(payload);
            }
        }
        callback({ status: 'received' });
        playSound()
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

                updateChat(payload, 0);
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
                    senderProfilePicture: userData.profilePicture,
                    receiverId: selectedChatData.receiverId,
                    body: curMessageObj[selectedChatData.chatId],
                    chatId: selectedChatData.chatId,
                    sentAt: new Date(),
                    newChat: false
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
                        displayedName: userData.displayedName,
                        senderProfilePicture: userData.profilePicture,
                        receiverId: selectedChatData.receiverId,
                        body: curMessageObj[selectedChatData.chatId],
                        sentAt: new Date(),
                        chatId,
                        newChat: true
                    }

                    sendMessage(payload);

                    const newChat = {
                        chatType: 'existed-chat',
                        chatId,
                        receiverId: receiverRecord._id,
                        displayedName: receiverRecord.displayedName,
                        profilePicture: receiverRecord.profilePicture,
                        lastMessage: lastMessageRecord.body,
                        lastMessageDate: moment(lastMessageRecord.sentAt).format('LT'),
                        isSelected: true,
                        pending: 0,
                        fetchMgs: false
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
                    console.log(`Error in creating new chat: ${error}`);
                    if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
                        clearUserData();
                    }
                }


            }
        }
        else if (event.key === 'Escape') {
            setEmojiPicker(false);
        }
    };

    const handleScroll = debounce((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        setReachedTopChat(scrollTop === 0);
        lastScrollHeight.current = scrollHeight;
    }, 200)

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            const scrollTo = (reachedTopChat) ? container.scrollHeight - lastScrollHeight.current : container.scrollHeight;
            const behavior = (reachedTopChat) ? 'auto' : 'smooth'
            container.scrollTo({
                top: scrollTo,
                behavior
            });
        }
    }, [messages[selectedChatData.chatId]])

    return (
        <div className="conversation-display">
            {
                (messagesLoading) && <LoadingDots style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translate(-50%, 0%)' }}></LoadingDots>
            }
            {
                (selectedChatData.chatId) &&
                <div className="conversation-header">
                    <div className="info">
                        <img src={selectedChatData.profilePicture}></img>
                        <p className='name'>{selectedChatData.displayedName}</p>
                    </div>
                </div>
            }
            <div className='conversation' ref={scrollRef} onScroll={handleScroll} >
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
                            <IoSend className='icon' />
                        </div>
                    </div>
                </div>

            }
            <audio ref={audioRef} src="../../public/msg-sound.mp3" preload="auto" />
        </div>
    )
}

export default Conversation