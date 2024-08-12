import React, { useEffect, useState } from 'react'
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import api from '../../api/api.jsx'
import { messageRoute } from '../../routes/routes.js'

import './Chat.css'
const Chat = ({ chat }) => {
    const limit = 10;
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const {
        setSelectedChatData,
        selectedChatData,
        setMessages,
        reachedTopChat,
        messagesLoading,
        setMessagesLoading,
        setChats,
    } = useGlobalState();

    const loadMessages = async () => {
        try {
            setMessagesLoading(true)

            const response = await api.get(messageRoute.list, {
                params: { limit, skip, chatId: chat.chatId }
            })
            const fetchedMessages = response.data.data;
            fetchedMessages.reverse()
            setMessages((prev) => {

                return {
                    ...prev,
                    [chat.chatId]: [...fetchedMessages,
                    ...(prev[chat.chatId] || [])
                    ]
                }
            });
            setSkip((prev) => prev + limit);
            setHasMore(fetchedMessages.length === limit) // If fewer messages are fetched than limit, no more messages

        } catch (error) {
            console.log(`Error in loading messages: ${error}`);
            if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
                clearUserData();
            }
        }
        finally {
            setMessagesLoading(false);
        }
    }

    useEffect(() => {
        if (chat.isSelected && chat.fetchMgs) {
            loadMessages();
        }
    }, [chat.isSelected])

    useEffect(() => {
        if ((reachedTopChat) && (selectedChatData.chatId === chat.chatId) && !messagesLoading && hasMore) {
            loadMessages();
        }
    }, [reachedTopChat])

    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };

    return (
        <div className='chat-container' onClick={() => {
            setSelectedChatData({ chatType: 'existed-chat', ...chat });
            chat.isSelected = true;
            setChats((prev) => {
                return prev.map((cur) => {
                    return (cur.chatId === chat.chatId)
                        ? {
                            ...cur,
                            pending: 0
                        }
                        : cur
                })
            })
        }}>
            {
                (chat.pending > 0) && <div className="alert-dot">{chat.pending}</div>
            }
            <div className="image-container">
                <img src={chat.profilePicture}></img>
            </div>
            <div className="info-container">
                <div className="name-time-container">
                    <div className="name-container">
                        {chat.displayedName}
                    </div>

                    <div className="time-container">
                        {chat.lastMessageDate}
                    </div>

                </div>
                <div className={isArabic(chat.lastMessage) ? "last-message-container last-message-container-rtl" : "last-message-container"}>
                    {chat.lastMessage}
                </div>
            </div>
        </div>
    )
}

export default Chat