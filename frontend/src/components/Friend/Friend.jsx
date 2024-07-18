import React from 'react'
import './Friend.css'
const Friend = ({ data }) => {
    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };
    return (
        <div className='friend-container'>
            <div className="image-container">
                <img src={data.image}></img>
            </div>
            <div className="info-container">
                <div className="name-container">
                    {data.name}
                </div>
                <div className={isArabic(data.lastMessage) ? "last-message-container last-message-container-rtl" : "last-message-container"}>
                    {data.lastMessage}
                </div>
            </div>
        </div>
    )
}

export default Friend