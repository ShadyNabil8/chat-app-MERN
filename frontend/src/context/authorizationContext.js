import React, { createContext, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const authorizationContext = createContext();

const authorizationProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        displayedName: '',
        email: '',
        profilePicture: '',
        friends: []
    });

    const history = useHistory();


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
            history.push('/user/login');
        }

        /**
         * By returning Promise.reject(error), the error is propagated down the promise chain.
         *  This means that any .catch block or try/catch in an async/await context can handle the error properly.
         */
        return Promise.reject(error);
    });

    const login = () => {

    }

    const logout = () => {

        setUserData({
            displayedName: '',
            email: '',
            profilePicture: '',
            friends: []
        });

        history.push('./user/login')
    }

    return (
        <authorizationContext.Provider value={{ login, logout, userData }}>
            {children}
        </authorizationContext.Provider>
    )
}

export const useAuthorization = () => {
    return useContext(authorizationContext)
}