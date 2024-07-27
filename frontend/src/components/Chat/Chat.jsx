import React from 'react'
import { useMessages } from '../../context/messagesContext.jsx';
import './Chat.css'
const Chat = ({ data }) => {

    const { setSelectedChat } = useMessages();

    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };

    return (
        <div className='friend-container' onClick={() => setSelectedChat(data.id)}>
            <div className="image-container">
                <img src={data.image}></img>
            </div>
            <div className="info-container">
                <div className="name-time-container">
                    <div className="name-container">
                        {data.name}
                    </div>
                    <div className="time-container">
                        {'1.52AM'}
                    </div>
                </div>
                <div className={isArabic(data.lastMessage) ? "last-message-container last-message-container-rtl" : "last-message-container"}>
                    {data.lastMessage}
                </div>
            </div>
        </div>
    )
}

export default Chat