import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { testMessages } from '../assets/assets'


const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [messages, setMessages] = useState(testMessages);
    const [selectedChat, setSelectedChat] = useState('');
    const [selectedNav, setSelectedNav] = useState('explore')

    const addMessage = (message, chatId) => {
        setMessages((prev) => {
            return {
                ...prev,
                [chatId]: [...(prev[chatId] || []), message]
            }
        })
    }

    return (
        <globalStateContext.Provider value=
            {{
                messages,
                addMessage,
                selectedChat,
                setSelectedChat,
                selectedNav,
                setSelectedNav
            }}>
            {children}
        </globalStateContext.Provider>
    )
}

export const useGlobalState = () => useContext(globalStateContext)



