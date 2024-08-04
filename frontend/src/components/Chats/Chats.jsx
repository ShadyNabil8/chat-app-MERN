import { React, useEffect, useState } from 'react'
import Chat from '../Chat/Chat'
import api from '../../api/api.jsx'
import { useAuth } from '../../context/authContext';

import './Chats.css'
const Chats = ({ chats, setChats }) => {
    // console.log("------------> Chats");

    return (
        <div className='chats-container'>
            {
                chats.map((chat, index) => <Chat key={index} chat={chat}></Chat>)
            }
        </div>
    )
}

export default Chats
