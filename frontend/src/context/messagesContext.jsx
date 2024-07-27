import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { testMessages } from '../assets/assets'


const messagesContext = createContext();

export const MessagesProvider = ({ children }) => {
    const [messages, setMessages] = useState(testMessages);
    const [selectedChat, setSelectedChat] = useState('');

    const addMessage = (message, chatId) => {
        setMessages((prev) => {
            return {
                ...prev,
                [chatId]: [...(prev[chatId] || []), message]
            }
        })
    }

    return (
        <messagesContext.Provider value={{ messages, addMessage, selectedChat, setSelectedChat }}>
            {children}
        </messagesContext.Provider>
    )
}

export const useMessages = () => useContext(messagesContext)



