import React, { useState, useEffect } from 'react'
import './ExploredUser.css'
import { IoPersonAdd } from "react-icons/io5";
import { useSocket } from '../../context/SocketContext.jsx'
import { useAuth } from '../../context/authContext';
import { IoMdCheckmark } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaUserTimes } from "react-icons/fa";
import { useGlobalState } from '../../context/GlobalStateContext.jsx';
import LoadingDots from '../../components/LoadingDots/LoadingDots'
import api from '../../api/api.jsx'
import { notificationRoute } from '../../routes/routes.js'
import { CiStopwatch } from "react-icons/ci";

const ExploredUser = ({ data }) => {

  const { emitEvent } = useSocket();
  const { authState } = useAuth();
  const [displayOption, setDisplayOption] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deletingLoading, setDeletingLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const {
    deleteFriend,
  } = useGlobalState();


  const handleAddFriend = async () => {
    try {
      setLoading(true);
      const notificationData = {
        senderId: authState.userData.userId,
        receriverId: data._id,
        notification: 'Hay, I want to be your friend',
        type: 'friend_request'
      }
      await api.post(notificationRoute.send, notificationData);
      setRequestSent(true);
      emitEvent('notification', notificationData, (response) => {
        console.log(response.message);
      })
    } catch (error) {
      console.log(`Error while seding notification: ${error}`);
      if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
        clearUserData();
      }
    }
    finally {
      setLoading(false);
    }
  }

  const handleDeleteFriend = async () => {
    try {
      setDeletingLoading(true);
      await deleteFriend(data._id);
      data.isFriend = false;
      setDisplayOption(false);
    } catch (error) {
      console.log(`Error in deleting friend: ${error}`);
      if ((error.response.data.error) && (error.response.data.error.cause === 'authorization')) {
        clearUserData();
      }
    }
    finally {
      setDeletingLoading(false);
    }

  }

  return (
    <div style={{ position: 'relative' }}>
      <div className='explored-user-container' style={(loading) ? { pointerEvents: 'none', opacity: '0.5' } : {}}>
        {
          (displayOption) &&
          < div className="options-container">
            <div className="option-container">
              <div className="delete-option option" style={(deletingLoading) ? { pointerEvents: 'none', opacity: '0.5' } : {}} onClick={() => handleDeleteFriend()}>
                <FaUserTimes className='icon' />
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
                ? <CiStopwatch className='icon'></CiStopwatch>
                : (!requestSent)
                  ? <IoPersonAdd className='icon' onClick={() => handleAddFriend()} />
                  : <IoMdCheckmark className='icon'></IoMdCheckmark>
          }
        </div>
      </div >
      {
        (loading) && <LoadingDots style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></LoadingDots>
      }
    </div>
  )
}

export default ExploredUser