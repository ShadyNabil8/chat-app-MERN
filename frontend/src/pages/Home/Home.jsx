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
  const [chats, setChats] = useState([]);

  const { selectedNav } = useGlobalState();

  const fetchChats = async () => {
    try {

      const [chatsResponse, friendsResponse] = await Promise.all([
        api.get(chatRoute.list),
        api.get(friendsRoute.list)
      ])
      const friendsRecord = friendsResponse.data.data;
      const chatsRecord = chatsResponse.data.data;
      console.log(chatsRecord);

      const friendsChats = friendsRecord.map((friend) => {
        return {
          chatType: 'new-chat',
          chatId: friend._id,
          receiverId: friend._id,
          displayedName: friend.displayedName,
          profilePicture: friend.profilePicture,
        }
      })

      const existedChats = chatsRecord.map((chat) => {
        return {
          chatType: 'existed-chat',
          chatId: chat._id,
          receiverId: chat.participants[0]._id,
          displayedName: chat.participants[0].displayedName,
          profilePicture: chat.participants[0].profilePicture,
          lastMessage: chat.lastMessage.body
        }
      })

      setChats((prev) => {
        return [
          ...friendsChats,
          ...existedChats
        ]
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchChats();
  }, [])

  return (
    <SocketProvider>
      <div className='home'>
        <Chats chats={chats} setChats={setChats}></Chats>
        <Conversation setChats={setChats} fetchChats={fetchChats}></Conversation>
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