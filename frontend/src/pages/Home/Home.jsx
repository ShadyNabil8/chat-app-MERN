import React, { useState, useEffect, useRef } from 'react'
import Explore from '../../components/Explore/Explore'
import Conversation from '../../components/Conversation/Conversation'
import Chats from '../../components/Chats/Chats.jsx'
import Header from '../../components/Header/Header'
import { useAuth } from '../../context/authContext';
import api from '../../api/api.jsx'
import { MessagesProvider } from '../../context/messagesContext.jsx'
import './Home.css'

const Home = () => {
  const { authState, setAuthState } = useAuth();

  const { isAuthenticated, userData } = authState;

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
            friends: []
          }
        });

      }
    }

    if (!isAuthenticated) {
      fetchProfile();
    }

  }, [] /* [setUserData] */);

  return (
    <div className='home'>
      <MessagesProvider>
        <Chats></Chats>
        <Conversation></Conversation>
        <Explore></Explore>
        <Header></Header>
      </MessagesProvider>
    </div >
  )
}

export default Home