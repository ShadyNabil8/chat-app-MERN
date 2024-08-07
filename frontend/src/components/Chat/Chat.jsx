import React, { useEffect, useState } from 'react'
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import LoadingDots from '../../components/LoadingDots/LoadingDots'
import api from '../../api/api.jsx'
import { messageRoute } from '../../routes/routes.js'

import './Chat.css'
const Chat = ({ chat }) => {
    const limit = 20;
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const {
        setSelectedChatData,
        setMessages
    } = useGlobalState();

    useEffect(() => {
        const loadMessages = async () => {
            try {
                setIsLoading(true)
                console.log(`limit: ${limit}`);
                console.log(`skip: ${skip}`);
                console.log(`chatId: ${chat.chatId}`);

                const response = await api.get(messageRoute.list, {
                    params: { limit, skip, chatId: chat.chatId }
                })
                const fetchedMessages = response.data.data;

                setMessages((prev) => {
                    return {
                        ...prev,
                        [chat.chatId]: [...fetchedMessages,
                        ...prev[chat.chatId]
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
                setIsLoading(false);
            }
        }
        loadMessages();
    }, [])

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop === 0 && !isLoading && hasMore) {
            loadMessages(); // Load more messages when scrolled to the top
        }
    };

    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };

    return (
        <div className='chat-container' onClick={() => {
            setSelectedChatData({ chatType: 'existed-chat', ...chat })
        }}>
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