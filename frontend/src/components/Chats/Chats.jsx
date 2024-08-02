import { React, useEffect, useState } from 'react'
import Chat from '../Chat/Chat'
import image1 from '../../assets/naruto.jpeg'
import image2 from '../../assets/Kakashi.webp'
import api from '../../api/api.jsx'
import { friendsRoute } from '../../routes/routes.js'

import './Chats.css'
const Chats = () => {
    console.log("------------> Chats");
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        try {
            const response = await api.get(friendsRoute.list)
            setChats(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchChats();
    }, [])

    return (
        <div className='chats-container'>
            {
                chats.map((chat, index) => <Chat key={index} data={{ image: chat.profilePicture, name: chat.displayedName, lastMessage: "How are you? My name is shady", id: 'room1' }}></Chat>)
            }
        </div>
    )
}

export default Chats
