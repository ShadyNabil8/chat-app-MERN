import React, { createContext, useContext, useEffect, useState } from 'react';
import socket from '.././services/socket';
import { useAuth } from '../context/authContext';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const { authState } = useAuth();

    useEffect(() => {
        console.log(authState.isAuthenticated);
        if (authState.isAuthenticated) {
            socket.on('connect', () => {
                console.log("Socket connected");
                socket.emit('identify', authState.userData.userId, (response) => {
                    console.log(response.message);
                });
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                console.log("************* Socket disconnected");
                setIsConnected(false);
            });
        }

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [authState]);

    useEffect(() => {
        if (authState.isAuthenticated) {
            socket.emit('identify', authState.userData.userId, (response) => {
                console.log(response.message);
            });
        }
    }, [authState]);

    const emitEvent = (event, data, callback) => {
        if (socket) {
            socket.emit(event, data, (response) => {
                if (callback) {
                    callback(response);
                }
            });
        }
    };

    const contextValue = {
        socket,
        isConnected,
        emitEvent
    }

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    )
}

