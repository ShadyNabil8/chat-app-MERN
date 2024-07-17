import React from 'react'
import './Friend.css'
const Friend = ({ data }) => {
    return (
        <div className='friend-container'>
            <div className="image-container">
                <img src={data.image}></img>
            </div>
            <div className="info-container">
                <div className="name-container">
                    {data.name}
                </div>
                <div className="last-message-container">
                    {data.lastMessage}
                </div>
            </div>
        </div>
    )
}

export default Friend