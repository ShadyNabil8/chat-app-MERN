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

        if (response.data && response.data.success) {

            const { displayedName, email, profilePicture, friends } = response.data.data;

            setAuthState({
                isAuthenticated: true,
                userData: {
                    displayedName: displayedName,
                    email: email,
                    profilePicture: profilePicture,
                    friends: friends
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
        console.log(authState.isAuthenticated);
        if (authState.isAuthenticated) {
            navigate('./home')
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