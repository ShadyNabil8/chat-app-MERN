import { React, useEffect, useState } from 'react'
import Chat from '../Chat/Chat'
import image1 from '../../assets/naruto.jpeg'
import './Chats.css'
const Chats = () => {
    return (
        <div className='chats-container'>
            <Chat data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you? My name is shady", id: 1 }}></Chat>
            <Chat data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you?", id: 2 }}></Chat>
        </div>
    )
}

export default Chats
