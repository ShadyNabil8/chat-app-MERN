import React from 'react'
import './Verification.css'
const Verification = ({ responseMessage, setResponseMessage, setRegistrationData }) => {
  const handleOnClick = () => {
    setResponseMessage('');
    setRegistrationData({ email: '', displayedName: '', password: '' });
  }
  return (
    <div className='verification-box'>
      <div className="header">
        Registiration successful
      </div>
      <div className="body">
        {responseMessage}
      </div>
      <button onClick={handleOnClick}>
        Close
      </button>
    </div>
  )
}

export default Verification
