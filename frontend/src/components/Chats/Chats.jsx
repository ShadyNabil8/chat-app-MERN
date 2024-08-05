import { React, useEffect, useState } from 'react'
import Chat from '../Chat/Chat'
import api from '../../api/api.jsx'
import { useAuth } from '../../context/authContext';
import { useGlobalState } from '../../context/GlobalStateContext.jsx'
import LoadingDots from '../../components/LoadingDots/LoadingDots'

import './Chats.css'
const Chats = () => {
    // console.log("------------> Chats");
    const { chats, fetchChats } = useGlobalState();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // This time out is just for fun!
        setTimeout(() => {
            fetchChats();
            setIsLoading(false)
        }, 1000)
    }, [])

    return (
        <div className='chats-container'>
            <div className="search-bar">
                <input type='text' placeholder='Search for friends' onChange={(e) => setSearchQuery(e.target.value)}></input>
            </div>
            <div className="chats">
                {
                    (!isLoading) ?
                        chats.map((chat, index) => <Chat key={index} chat={chat}></Chat>)
                        : <LoadingDots></LoadingDots>
                }
            </div>
        </div>
    )
}

export default Chats
