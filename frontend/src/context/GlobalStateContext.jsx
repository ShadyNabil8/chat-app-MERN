import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

const globalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState('');
    const [selectedNav, setSelectedNav] = useState('explore')

    return (
        <globalStateContext.Provider value=
            {{
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



