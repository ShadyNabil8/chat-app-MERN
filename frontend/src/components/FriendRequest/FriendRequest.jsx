import React, { useState } from 'react'
import api from '../../api/api.jsx'
import { notificationRoute } from '../../routes/routes.js'
import LoadingDots from '../../components/LoadingDots/LoadingDots'
import { useSocket } from '../../context/SocketContext.jsx'

import './FriendRequest.css'
const FriendRequest = ({ data, setNotifications }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { emitEvent } = useSocket();

    const handleFriendRequest = async (action) => {
        try {
            console.log(data);

            setIsLoading(true)
            const response = await api.post(notificationRoute.action,
                {
                    notificationId: data._id,
                    action
                }
            )

            setNotifications((prev) => {
                return prev.filter((req) => req._id != data._id)
            })

            const requestState = (action === 'confirm') ? 'confermed' : 'refused';

            const notificationData = {
                senderId: data.receiver._id,
                receriverId: data.requester._id,
                notification: `${data.receiver.displayedName} has ${requestState} your request`,
                type: 'friend_response'
            }
            emitEvent('notification', notificationData, (response) => {
                console.log(response.message);
            })

        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <div className='friend-req-item' style={(isLoading) ? { pointerEvents: 'none', opacity: '0.5' } : {}}>
                <div className="image">
                    <img src={data.requester.profilePicture}>
                    </img>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    gap: '7px',
                    flex: '1',
                }}>
                    <div className="name">
                        {data.requester.displayedName}
                    </div>
                    <div className="actions">
                        <button className='button confirm-btn' onClick={(e) => { handleFriendRequest('confirm') }}>
                            Confirm
                        </button>
                        <button className='button delete-btn' onClick={(e) => { handleFriendRequest('delete') }}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            {
                (isLoading) && <LoadingDots style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></LoadingDots>
            }
        </div>

    )
}

export default FriendRequest
