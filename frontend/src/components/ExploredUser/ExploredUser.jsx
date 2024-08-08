import React, { useState, useEffect } from 'react'
import './ExploredUser.css'
import { IoPersonAdd } from "react-icons/io5";
import { useSocket } from '../../context/SocketContext.jsx'
import { useAuth } from '../../context/authContext';
import { IoMdCheckmark } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import LoadingDots from '../../components/LoadingDots/LoadingDots'

const ExploredUser = ({ data }) => {

  const { emitEvent } = useSocket();
  const { authState } = useAuth();
  const [displayOption, setDisplayOption] = useState(false)
  const [deletingLoading, setDeletingLoading] = useState(false)

  const {
    deleteFriend,
  } = useGlobalState();


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

  const handleDeleteFriend = async () => {
    setDeletingLoading(true);
    await deleteFriend(data._id);
    setDeletingLoading(false);
  }

  return (
    <div className='explored-user-container'>
      {
        (displayOption) &&
        < div className="options-container">
          <div className="option-container">
            <div className="delete-option option" style={(deletingLoading) ? { pointerEvents: 'none', opacity: '0.5' } : {}} onClick={() => handleDeleteFriend()}>
              <IoPersonRemoveOutline className='icon' />
              <p>Unfriend</p>
            </div>
            {
              (deletingLoading) && <LoadingDots style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></LoadingDots>
            }
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
              : <IoPersonAdd className='icon' onClick={handleAddFriend} />
        }
      </div>
    </div >
  )
}

export default ExploredUser