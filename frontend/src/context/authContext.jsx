import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        displayedName: '',
        email: '',
        profilePicture: '',
        friends: []
    });

    const navigate = useNavigate();


    axios.interceptors.response.use(function (response) {

        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;

    }, function (error) {

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        if (error.response && error.response.status === 401) {
            setUser({
                displayedName: '',
                email: '',
                profilePicture: '',
                friends: []
            });
            navigate.push('/login');
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

            setUserData({
                displayedName: displayedName,
                email: email,
                profilePicture: profilePicture,
                friends: friends
            });
        }
        navigate('./home')

    }

    const logout = () => {

        setUserData({
            displayedName: '',
            email: '',
            profilePicture: '',
            friends: []
        });

        navigate.push('./login')
    }

    return (
        <authContext.Provider value={{ login, logout, userData }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuthorization = () => {
    return useContext(authContext)
}