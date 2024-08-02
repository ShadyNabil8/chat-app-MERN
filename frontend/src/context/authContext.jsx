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

    const login = async (userEmail, userPassword) => {
        const url = 'user/login'

        const response = await api.post(url, {
            email: userEmail,
            password: userPassword
        });
        console.log(response);
        await fetchProfile();
    }

    const logout = () => {

        localStorage.removeItem('chatAppToken');

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
            console.log(error);
            navigate('./login')
        }
    }

    useEffect(() => {
        if (!authState.isAuthenticated) {
            fetchProfile();
        }
    }, [authState]);

    return (
        <authContext.Provider value={{ login, logout, authState, setAuthState }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(authContext)
}