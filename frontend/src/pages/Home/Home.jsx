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
import './Home.css'

const Home = () => {
  // console.log("------------> Home");

  const { authState, setAuthState } = useAuth();
  const { isAuthenticated } = authState;

  const { selectedNav } = useGlobalState();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('user/profile');
        const { displayedName, email, profilePicture, friends, userId } = response.data.data;

        setAuthState({
          isAuthenticated: true,
          userData: {
            displayedName,
            email,
            profilePicture,
            friends,
            userId
          }
        });

      } catch (error) {
        console.log(error);
        setAuthState({
          isAuthenticated: false,
          userData: {
            displayedName: '',
            email: '',
            profilePicture: '',
            friends: [],
            userId:''
          }
        });

      }
    }

    if (!isAuthenticated) {
      fetchProfile();
    }

  }, [] /* [setUserData] */);

  return (
    <SocketProvider>
      <div className='home'>
        <Chats></Chats>
        <Conversation></Conversation>
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