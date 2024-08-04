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
        fetchChats();
        setIsLoading(false)
    }, [])

    return (
        <div className='chats-container'>
            {
                (!isLoading) ?
                    chats.map((chat, index) => <Chat key={index} chat={chat}></Chat>)
                    : <LoadingDots></LoadingDots>
            }
        </div>
    )
}

export default Chats
