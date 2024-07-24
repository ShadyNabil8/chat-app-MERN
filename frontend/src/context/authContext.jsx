import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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


    axios.interceptors.request.use(
        (config) => {
            console.log('in REQ');
            const token = localStorage.getItem('chatAppToken');

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


    axios.interceptors.response.use(function (response) {

        // Any status code that lie within the range of 2xx cause this function to trigger
        console.log('in RES');
        if (response.data.token) {
            localStorage.setItem('chatAppToken', response.data.token);
        }

        return response;

    }, function (error) {

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        if (error.response && error.response.status === 401) {
            setAuthState({
                isAuthenticated: false,
                userData: {
                    displayedName: '',
                    email: '',
                    profilePicture: '',
                    friends: []
                }
            })
        }

        /**
         * By returning Promise.reject(error), the error is propagated down the promise chain.
         *  This means that any .catch block or try/catch in an async/await context can handle the error properly.
         */
        return Promise.reject(error);
    });

    const login = async (email, password) => {

        const url = 'http://localhost:5000/user/login'

        const response = await axios.post(url, {
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
        <authContext.Provider value={{ login, logout, authState }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(authContext)
}