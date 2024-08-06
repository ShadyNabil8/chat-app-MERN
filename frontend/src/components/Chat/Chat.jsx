import React from 'react'
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import './Chat.css'
const Chat = ({ chat }) => {
    const { setSelectedChatData } = useGlobalState();
    
    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };    

    return (
        <div className='chat-container' onClick={() => {
            setSelectedChatData({ chatType:'existed-chat', ...chat })
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