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
            friends: [],
            userId: ''
        }
    })

    const navigate = useNavigate();

    const clearUserData = () => {
        setAuthState({
            isAuthenticated: false,
            userData: {
                displayedName: '',
                email: '',
                profilePicture: '',
                friends: [],
                userId: ''
            }
        });
    }

    const login = async (userEmail, userPassword) => {
        const url = 'user/login'

        await api.post(url, {
            email: userEmail,
            password: userPassword
        });
        await fetchProfile();
    }

    const logout = () => {

        localStorage.removeItem('chatAppToken');
        clearUserData();
    }

    const fetchProfile = async () => {
        try {
            const response = await api.get('user/profile');
            const { displayedName, email, profilePicture, friends, userId } = response.data.data;

            setAuthState({
                isAuthenticated: true,
                userData: {
                    displayedName,
                    email,
                    profilePicture,
                    friends,
                    userId
                }
            });
            navigate('./home')
        } catch (error) {
            console.log(`Error in fetching profile: ${error}`);
            navigate('./login')
        }
    }

    useEffect(() => {
        if (!authState.isAuthenticated) {
            fetchProfile();
        }
    }, [authState]);

    return (
        <authContext.Provider value={{ login, logout, authState, setAuthState, clearUserData }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(authContext)
}