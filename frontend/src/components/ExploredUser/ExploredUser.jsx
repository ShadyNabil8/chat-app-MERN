import React from 'react'
import './ExploredUser.css'
import image from '../../assets/naruto.jpeg'
import { IoPersonAdd } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { useSocket } from '../../context/SocketContext.jsx'
import { useAuth } from '../../context/authContext';

const ExploredUser = ({ data }) => {

  const { emitEvent } = useSocket();
  const { authState } = useAuth();

  const handleAddFriend = () => {
    const notification = {
      senderId: authState.userData.userId,
      receriverId: data._id,
      notification: 'Friend req'
    }
    emitEvent('notification', notification, (response) => {
      console.log(response.message);
    })
  }
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
        <IoPersonAdd className='add-friend' onClick={handleAddFriend} />
        <MdMessage className='send-message' />
      </div>
    </div>
  )
}

export default ExploredUser