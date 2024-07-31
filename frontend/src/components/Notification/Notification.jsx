import React from 'react'
import './Notification.css'
import { friendRequests } from '../../assets/assets.js'
import FriendRequest from '../../components/FriendRequest/FriendRequest'

const Notification = () => {
    // console.log("------------> Notification");

    return (
        <div className="notification-container">
            {friendRequests.map((req, index) => <FriendRequest key={index} data={{ image: req.image, name: req.name }}></FriendRequest>)}
        </div>
    )
}

export default Notification
