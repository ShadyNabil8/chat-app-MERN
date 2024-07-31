import React, { createContext, useContext, useEffect, useState } from 'react';
import socket from '.././services/socket';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            console.log("Socket connected");
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const contextValue = {
        socket,
        isConnected,
    }
    
    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    )
}

