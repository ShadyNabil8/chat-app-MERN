import React, { useEffect, useState } from 'react'
import './Notification.css'
import { friendRequests } from '../../assets/assets.js'
import FriendRequest from '../../components/FriendRequest/FriendRequest'
import api from '../../api/api.jsx'
import { useAuth } from '../../context/authContext';
import LoadingDots from '../../components/LoadingDots/LoadingDots'
import { useGlobalState } from '../../context/GlobalStateContext.jsx'

const Notification = () => {
    // console.log("------------> Notification");
    const [notifications, setNotifications] = useState([])
    const { authState, clearUserData } = useAuth();
    const [loading, setLoading] = useState(false)
    const { selectedNav } = useGlobalState();

    const userData = authState.userData;
    useEffect(() => {
        console.log('not');
        
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const url = 'notification/list'
                const response = await api.get(url, { params: { userId: userData.userId } })
                setNotifications(response.data.data)
            } catch (error) {
                console.log(`Error in loading notifications: ${error}`);
                if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
                    clearUserData();
                }
            }
            finally {
                setLoading(false);
            }
        }
        if (selectedNav === 'notification') {
            fetchNotifications();
        }
    }, [selectedNav])

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <div className="notification-container">
                {notifications.map((req, index) => <FriendRequest key={index} data={req} setNotifications={setNotifications}></FriendRequest>)}
            </div>
            {
                (loading) && <LoadingDots style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></LoadingDots>
            }
        </div>
    )
}

export default Notification
