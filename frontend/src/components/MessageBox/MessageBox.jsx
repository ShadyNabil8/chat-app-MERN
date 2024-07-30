import { React, useEffect } from 'react'
import './MessageBox.css'

const MessageBox = ({ responseMessage, setResponseMessage, setMessageBox, setIsRegistered }) => {
  const handleOnClick = () => {
    setResponseMessage({ title: '', body: '' });
    setMessageBox(false);
  }
  useEffect(() => {
    if (responseMessage.title === 'Registiration successful') {
      setIsRegistered(true);
    }
  })
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
