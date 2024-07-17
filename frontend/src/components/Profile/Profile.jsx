import React from 'react'
import './Profile.css'
import image from '../../assets/naruto.jpeg'
import { IoPersonAdd } from "react-icons/io5";
import { MdMessage } from "react-icons/md";

const Profile = () => {
    return (
        <div className='profile'>
            <div className="image-container">
                <img src={image}>
                </img>
                <div className="active-dot">

                </div>
            </div>
            <div className="name-container">
                Shady Nabil
            </div>
            <div className="actions-container">
                <IoPersonAdd className='add-friend' />
                <MdMessage className='send-message' />

            </div>
        </div>
    )
}

export default Profile