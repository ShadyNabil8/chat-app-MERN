import { React, useEffect, useState } from 'react'
import Chat from '../Chat/Chat'
import api from '../../api/api.jsx'
import { friendsRoute } from '../../routes/routes.js'
import { useAuth } from '../../context/authContext';

import './Chats.css'
const Chats = () => {
    // console.log("------------> Chats");
    const { authState } = useAuth();
    const [friends, setFriends] = useState([]);

    const fetchChats = async () => {
        try {
            const response = await api.get(friendsRoute.list)
            setFriends(response.data.data)
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
                friends.map((friend, index) => <Chat key={index} data={{
                    image: friend.profilePicture,
                    name: friend.displayedName,
                    lastMessage: "",
                    lastMessageDate: '',
                    receiverId: friend._id,
                }}>
                </Chat>)
            }
        </div>
    )
}

export default Chats
