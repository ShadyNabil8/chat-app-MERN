import { React, useState } from 'react'
import { IoIosNotifications } from "react-icons/io";
import { VscSignOut } from "react-icons/vsc";
import { useAuth } from '../../context/authContext';
import { MdOutlineExplore } from "react-icons/md";
import { useGlobalState } from '../../context/GlobalStateContext.jsx'

import './Header.css'

const Header = () => {
    // console.log("------------> Header");

    const [options, setOptions] = useState(false)

    const { authState, logout } = useAuth();
    const { userData } = authState;

    const { setSelectedNav } = useGlobalState();

    const toggleOptionsBox = () => {
        setOptions((prev) => !prev)
    }

    return (
        <div className="nav-bar">
            <div className="icons">
                <div className="notification">
                    <IoIosNotifications className='notification-icon icon' onClick={() => setSelectedNav('notification')} />
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
        </div>
    )
}

export default Header
