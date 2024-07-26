import { React, useState } from 'react'
import FriendRequest from '../../components/FriendRequest/FriendRequest'
import { IoIosNotifications } from "react-icons/io";
import { friendRequests } from '../../assets/assets.js'
import { VscSignOut } from "react-icons/vsc";
import { useAuth } from '../../context/authContext';

import './Header.css'

const Header = ({ userData }) => {
    const [notificationBox, setNotificationBox] = useState(false)
    const [options, setOptions] = useState(false)

    const { logout } = useAuth();

    const toggleNotificationBox = () => {
        setNotificationBox((prev) => !prev)
    }

    const toggleOptionsBox = () => {
        setOptions((prev) => !prev)
    }

    return (
        <div className="header">
            <div className="options">
                <img className='profile-picture' src={userData.profilePicture} onClick={() => { toggleOptionsBox() }}></img>
                {
                    (options) &&
                    <div className="options-container">
                        <div className="view-profile-opt option">
                            <img className='profile-picture' src={userData.profilePicture}></img>
                            <p>{userData.displayedName}</p>
                        </div>
                        <div className="option logout-opt" onClick={() => { logout() }}>
                            <VscSignOut className="icon" />
                            <p>Logout</p>
                        </div>
                    </div>
                }
            </div>
            <div className="notification">
                <IoIosNotifications className='notification-icon' onClick={toggleNotificationBox} />
                {
                    (friendRequests.length) && <div className="notification-dot">
                        {friendRequests.length}
                    </div>
                }
                {
                    (notificationBox) && <div className="notification-container">
                        <div className="title">
                            Friend requests
                        </div>
                        {friendRequests.map((req, index) => <FriendRequest key={index} data={{ image: req.image, name: req.name }}></FriendRequest>)}
                    </div>
                }
            </div>
        </div>
    )
}

export default Header
