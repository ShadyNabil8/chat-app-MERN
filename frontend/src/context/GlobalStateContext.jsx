import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [selectedChatData, setSelectedChatData] = useState({
        chatType: '',
        chatId: '',
        image: '',
        name: '',
        receiverId: ''
    });
    const [selectedNav, setSelectedNav] = useState('explore')

    return (
        <globalStateContext.Provider value=
            {{
                selectedChatData,
                setSelectedChatData,
                selectedNav,
                setSelectedNav
            }}>
            {children}
        </globalStateContext.Provider>
    )
}

export const useGlobalState = () => useContext(globalStateContext)



