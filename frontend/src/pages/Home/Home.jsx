import React, { useState, useEffect, useRef } from 'react'
import Profile from '../../components/Profile/Profile'
import Explore from '../../components/Explore/Explore'
import Conversation from '../../components/Conversation/Conversation'
import Chats from '../../components/Chats/Chats.jsx'
import Header from '../../components/Header/Header'
import { useAuth } from '../../context/authContext';
import api from '../../api/api.jsx'

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      height: '100vh',
      gap: '20px',
      backgroundColor: '#2B2D31'
    }}>
      <Header userData={userData}></Header>
      <div style={{
        display: 'flex',
        flex: '1',
        maxHeight: '100%',
        boxSizing: 'border-box'
      }}>
        {/* <Profile></Profile> */}
        <Explore></Explore>
        <Conversation></Conversation>
        <Chats></Chats>
      </div >
    </div>
  )
}

export default Home