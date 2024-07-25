import React from 'react'
import './ExploredUser.css'
import image from '../../assets/naruto.jpeg'
import { IoPersonAdd } from "react-icons/io5";
import { MdMessage } from "react-icons/md";

const ExploredUser = ({ data }) => {
  return (
    <div className='explored-user-container'>
      <div className="info-container">
        <div className="image-container">
          <img src={data.profilePicture}></img>
        </div>
        <div className="name">
          {data.displayedName}
        </div>
      </div>
      <div className="actions-container">
        <IoPersonAdd className='add-friend' />
        <MdMessage className='send-message' />
      </div>
    </div>
  )
}

export default ExploredUser