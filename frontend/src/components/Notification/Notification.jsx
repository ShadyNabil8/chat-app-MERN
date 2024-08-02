import React, { useEffect, useState } from 'react'
import './Notification.css'
import { friendRequests } from '../../assets/assets.js'
import FriendRequest from '../../components/FriendRequest/FriendRequest'
import api from '../../api/api.jsx'
import { useAuth } from '../../context/authContext';

const Notification = () => {
    // console.log("------------> Notification");
    const [notifications, setNotifications] = useState([])
    const { authState } = useAuth();

    const userData = authState.userData;
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                console.log('in n hrer');
                const url = 'notification/list'
                const response = await api.get(url, { params: { userId: userData.userId } })
                setNotifications(response.data.data)
            } catch (error) {
                console.log(error);
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
