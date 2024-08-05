import React from 'react'
import './Message.css'
import moment from 'moment';


function Message({ data }) {
    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text);
    };

    return (
        <div className={data.myMessage ? 'message-container my-message' : 'message-container his-message'}>
            {
                (!data.myMessage) &&
                <div className="image-container">
                    <img src={data.senderProfilePicture}></img>
                </div>
            }
            <div className={isArabic(data.message) ? "message-body message-body-rtl" : "message-body"}>
                {data.message}
                <div className={data.myMessage ? 'message-date my-message-date' : 'message-date his-message-date'}>
                    {moment(data.lastMessageDate).format('LT')}
                </div>
            </div>
        </div>
    )
}

export default Message