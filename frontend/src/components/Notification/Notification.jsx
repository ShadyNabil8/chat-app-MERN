import React, { useEffect, useState } from 'react'
import './Notification.css'
import { friendRequests } from '../../assets/assets.js'
import FriendRequest from '../../components/FriendRequest/FriendRequest'
import api from '../../api/api.jsx'
import { useAuth } from '../../context/authContext';

const Notification = () => {
    // console.log("------------> Notification");
    const [notifications, setNotifications] = useState([])
    const { authState, clearUserData } = useAuth();

    const userData = authState.userData;
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                console.log('in n hrer');
                const url = 'notification/list'
                const response = await api.get(url, { params: { userId: userData.userId } })
                setNotifications(response.data.data)
            } catch (error) {
                console.log(`Error in loading notifications: ${error}`);
                if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
                    clearUserData();
                }
            }
        }

        fetchNotifications();
    }, [])

    return (
        <div className="notification-container">
            {notifications.map((req, index) => <FriendRequest key={index} data={req} setNotifications={setNotifications}></FriendRequest>)}
        </div>
    )
}

export default Notification
