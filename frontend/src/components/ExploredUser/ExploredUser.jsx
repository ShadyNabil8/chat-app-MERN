import React, { useState, useEffect } from 'react'
import './ExploredUser.css'
import { IoPersonAdd } from "react-icons/io5";
import { useSocket } from '../../context/SocketContext.jsx'
import { useAuth } from '../../context/authContext';
import { IoMdCheckmark } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoPersonRemoveOutline } from "react-icons/io5";

const ExploredUser = ({ data }) => {

  const { emitEvent } = useSocket();
  const { authState } = useAuth();
  const [displayOption, setDisplayOption] = useState(false)
  const handleAddFriend = () => {
    const notification = {
      senderId: authState.userData.userId,
      receriverId: data._id,
      notification: '',
      type: 'friend_request'
    }
    emitEvent('notification', notification, (response) => {
      console.log(response.message);
    })
  }


  return (
    <div className='explored-user-container'>
      {
        (displayOption) &&
        < div className="options-container">
          <div className="delete-option option">
            <IoPersonRemoveOutline className='icon'/>
            <p>Delete</p>
          </div>
        </div>
      }
      <div className="info-container">
        <div className="image-container">
          <img src={data.profilePicture}></img>
        </div>
        <div className="name">
          {data.displayedName}
        </div>
      </div>
      <div className="actions-container">
        {
          (data.isFriend)
            ? <HiDotsHorizontal className='icon' onClick={() => setDisplayOption((prev) => !prev)} />
            : (data.hasPendingRequest)
              ? <IoMdCheckmark className='icon'></IoMdCheckmark>
              : <IoPersonAdd className='add-friend icon' onClick={handleAddFriend} />
        }
      </div>
    </div >
  )
}

export default ExploredUser