import React from 'react'
import './Message.css'


function Message({ data }) {
    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };

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
                <div className={isArabic(data.text) ? "message-body message-body-rtl" : "message-body"}>
                    {data.text}
                </div>
            </div>
        </div>
    )
}

export default Message