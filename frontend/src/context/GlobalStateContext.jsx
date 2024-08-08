import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../api/api.jsx'
import moment from 'moment';
import { friendsRoute } from '../routes/routes.js'
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
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messages, setMessages] = useState({});
    const [reachedTopChat, setReachedTopChat] = useState(false);
    const { authState, clearUserData } = useAuth();

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

    const deleteFriend = async (friendId) => {
        try {
            console.log(friendId);
            await api.post(friendsRoute.delete, { friendId })
            setChats((prev) => {
                return prev.filter((chat) => chat.receiverId != friendId)
            })
        } catch (error) {
            console.log(`Error in deleting friend: ${error}`);
            if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
                clearUserData();
            }
        }
    }

    return (
        <globalStateContext.Provider value=
            {{
                selectedChatData,
                setSelectedChatData,
                selectedNav,
                setSelectedNav,
                chats,
                setChats,
                messages,
                setMessages,
                reachedTopChat,
                setReachedTopChat,
                messagesLoading,
                setMessagesLoading,
                deleteFriend
            }}>
            {children}
        </globalStateContext.Provider>
    )
}

export const useGlobalState = () => useContext(globalStateContext)



