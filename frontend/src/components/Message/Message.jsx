import React from 'react'
import './Message.css'


function Message({ data }) {
    return (
        <div className={data.myMessage ? 'message-container my-message' : 'message-container his-message'}>
            <div className="image-container">
                <img src={data.image}></img>
            </div>
            <div className="text-container">
                <div className="message-metadata">
                    <div className='sender-name'>
                        {data.sender}
                    </div>
                    <div className="message-date">
                        {data.date}
                    </div>
                </div>
                <div className="message-body">
                    {data.text}
                </div>
            </div>
        </div>
    )
}

export default Message