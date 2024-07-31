import { React, useEffect, useState } from 'react'
import Chat from '../Chat/Chat'
import image1 from '../../assets/naruto.jpeg'
import image2 from '../../assets/Kakashi.webp'
import './Chats.css'
const Chats = () => {
    // console.log("------------> Chats");
    return (
        <div className='chats-container'>
            <Chat data={{ image: image1, name: 'Shady Nabil', lastMessage: "How are you? My name is shady", id: 'room1' }}></Chat>
            <Chat data={{ image: image2, name: 'Ahmed Mahmoud', lastMessage: "How are you?", id: 'room2' }}></Chat>
        </div>
    )
}

export default Chats
