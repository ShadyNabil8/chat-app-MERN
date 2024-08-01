import React from 'react'
import './FriendRequest.css'
const FriendRequest = ({ data }) => {
    return (
        <div className='friend-req-item'>
            <div className="image">
                <img src={data.image}>
                </img>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems:'flex-start',
                justifyContent:'center',
                gap: '7px',
                flex: '1',
            }}>
                <div className="name">
                    {data.name}
                </div>
                <div className="actions">
                    <button className='button confirm-btn'>
                        Confirm
                    </button>
                    <button className='button delete-btn'>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FriendRequest
