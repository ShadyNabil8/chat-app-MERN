import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        userData: {
            displayedName: '',
            email: '',
            profilePicture: '',
            friends: []
        }
    })

    const navigate = useNavigate();

    const login = async (email, password) => {

        const url = 'user/login'

        const response = await api.post(url, {
            email: email,
            password: password
        });
        console.log(response);
        if (response.data && response.data.success) {

            const { displayedName, email, profilePicture, friends, userId } = response.data.data;

            setAuthState({
                isAuthenticated: true,
                userData: {
                    displayedName: displayedName,
                    email: email,
                    profilePicture: profilePicture,
                    friends: friends,
                    userId: userId 
                }
            });
        }
    }

    const logout = () => {

        localStorage.removeItem('chatAppToken');

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

    useEffect(() => {
        if (authState.isAuthenticated) {
            navigate('./home') // Will this make re-render?
        }
        else {
            navigate('./login')
        }

    }, [authState])

    return (
        <authContext.Provider value={{ login, logout, authState, setAuthState }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(authContext)
}