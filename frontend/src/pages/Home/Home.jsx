import React, { useState, useEffect, useRef } from 'react'
import Explore from '../../components/Explore/Explore'
import Conversation from '../../components/Conversation/Conversation'
import Notification from '../../components/Notification/Notification'
import Profile from '../../components/Profile/Profile'
import Chats from '../../components/Chats/Chats.jsx'
import Header from '../../components/Header/Header'
import { useAuth } from '../../context/authContext';
import { useGlobalState } from '../../context/GlobalStateContext.jsx'
import api from '../../api/api.jsx'
import { SocketProvider } from '../../context/SocketContext.jsx'
import { friendsRoute } from '../../routes/routes.js'
import { chatRoute } from '../../routes/routes.js'

import './Home.css'

const Home = () => {
  // console.log("------------> Home");

  const { selectedNav } = useGlobalState();
  return (
    <SocketProvider>
      <div className='home'>
        <Chats ></Chats>
        <Conversation ></Conversation>
        <div className="nav-components">
          {(selectedNav == 'notification') && <Notification></Notification>}
          {(selectedNav == 'explore') && <Explore></Explore>}
          {(selectedNav == 'profile') && <Profile></Profile>}
        </div>
        <Header></Header>
      </div >
    </SocketProvider>
  )
}

export default Home