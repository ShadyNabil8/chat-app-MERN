import React from 'react'
import './MessageBox.css'

const MessageBox = ({ responseMessage, setResponseMessage, setMessageBox }) => {
  const handleOnClick = () => {
    setResponseMessage({ title: '', body: '' });
    setMessageBox(false);
  }
  return (
    <div className='message-box'>
      <div className="header">
        {responseMessage.title}
      </div>
      <div className="body">
        {responseMessage.body}
      </div>
      <button onClick={handleOnClick}>
        Close
      </button>
    </div>
  )
}

export default MessageBox
