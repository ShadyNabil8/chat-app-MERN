import React from 'react'
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import './Friend.css'
const Friend = ({ friend }) => {

    const { setSelectedChatData, chats } = useGlobalState();

    return (
        <div className='friend-container' onClick={() => {
            const existedChat = chats.find((chat) => chat.receiverId === friend.receiverId);
            if (existedChat) {
                console.log('yes');
                setSelectedChatData({ chatType: 'existed-chat', ...existedChat })
            }
            else {
                setSelectedChatData({ chatType: 'new-chat', ...friend })
            }
        }}>
            <div className="image-container">
                <img src={friend.profilePicture}></img>
            </div>
            <div className="info-container">
                <div className="name-time-container">
                    <div className="name-container">
                        {friend.displayedName}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friend
