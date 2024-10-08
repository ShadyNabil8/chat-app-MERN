import { React, useEffect, useState, useRef } from 'react'
import { IoIosNotifications } from "react-icons/io";
import { VscSignOut } from "react-icons/vsc";
import { useAuth } from '../../context/authContext';
import { MdOutlineExplore } from "react-icons/md";
import { useGlobalState } from '../../context/GlobalStateContext.jsx'
import useSocketEvent from '../../hooks/useSocket.js'
import Hint from '../../components/Hint/Hint'

import './Header.css'

const Header = () => {
    // console.log("------------> Header");

    const [options, setOptions] = useState(false)
    const [notifications, setNotifications] = useState(0)
    const [hint, setHint] = useState('')

    const { authState, logout } = useAuth();
    const { userData } = authState;

    const { setSelectedNav } = useGlobalState();

    const audioRef = useRef(null);


    useSocketEvent('notification', ({ notification, type }, callback) => {
        // if (type !== 'friend_response') {
        // }
        setNotifications((prev) => prev + 1)
        callback({ status: 'received' });
        setHint(notification)
        playSound()
        setTimeout(() => {
            setHint('')
        }, 5000);
    })


    const toggleOptionsBox = () => {
        setOptions((prev) => !prev)
    }

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    return (
        <div className="nav-bar">
            <div className="icons">
                <div className="notification">
                    <Hint hint={hint}></Hint>
                    {
                        (notifications > 0) && <div className="notification-dot">{notifications}</div>
                    }
                    <IoIosNotifications className='notification-icon icon' onClick={() => { setSelectedNav('notification'); setNotifications(0) }} />
                </div>
                <MdOutlineExplore className='explore-icon icon' onClick={() => setSelectedNav('explore')} />
            </div>
            <div className="options">
                <img className='profile-picture' src={userData.profilePicture} onClick={() => { toggleOptionsBox() }}></img>
                {
                    (options) &&
                    <div className="options-container">
                        <div className="view-profile-opt option" onClick={() => setSelectedNav('profile')} >
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
            <audio ref={audioRef} src="../../public/notification-sound.mp3" preload="auto" />
        </div>
    )
}

export default Header
