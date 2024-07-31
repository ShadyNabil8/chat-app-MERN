import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000',
});

api.interceptors.request.use(
    (config) => {
        // console.log('in REQ');
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


api.interceptors.response.use(function (response) {

    // Any status code that lie within the range of 2xx cause this function to trigger
    // console.log('in RES');
    if (response.data.token) {
        localStorage.setItem('chatAppToken', response.data.token);
    }

    return response;

}, function (error) {

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    
    /**
     * By returning Promise.reject(error), the error is propagated down the promise chain.
     *  This means that any .catch block or try/catch in an async/await context can handle the error properly.
     */
    return Promise.reject(error);
});

export default api;
