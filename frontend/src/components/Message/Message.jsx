import React from 'react'
import './Message.css'
import moment from 'moment';
import { BsCheck2All,BsCheck2 } from "react-icons/bs";


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
                    <img src={data.senderProfilePicture || data.profilePicture}></img>
                </div>
            }
            <div className={isArabic(data.body) ? "message-body message-body-rtl" : "message-body"}>
                {data.body}
                {
                    (data.myMessage) && ((data.received) ? <BsCheck2All className='check-icon'/> : <BsCheck2 className='check-icon'/>)
                }
                <div className={data.myMessage ? 'message-date my-message-date' : 'message-date his-message-date'}>
                    {moment(data.sentAt).format('LT')}
                </div>
            </div>
        </div>
    )
}

export default Message