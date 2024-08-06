import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../api/api.jsx'
import moment from 'moment';
import { useAuth } from './authContext';

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [selectedChatData, setSelectedChatData] = useState({
        chatType: '',
        chatId: '',
        receiverId: '',
        profilePicture: '',
        displayedName: '',
    });
    const [selectedNav, setSelectedNav] = useState('explore')
    const [chats, setChats] = useState([]);

    const { authState } = useAuth();

    useEffect(() => {
        if (!authState.isAuthenticated) {
            setSelectedChatData({
                chatType: '',
                chatId: '',
                profilePicture: '',
                displayedName: '',
                receiverId: ''
            })
            setChats([])
        }
    }, [authState]);

    return (
        <globalStateContext.Provider value=
            {{
                selectedChatData,
                setSelectedChatData,
                selectedNav,
                setSelectedNav,
                chats,
                setChats,
            }}>
            {children}
        </globalStateContext.Provider>
    )
}

export const useGlobalState = () => useContext(globalStateContext)



