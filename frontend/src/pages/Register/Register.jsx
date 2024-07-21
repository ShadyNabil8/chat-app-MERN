import React, { useState, useEffect } from 'react'
import { Link, redirect } from "react-router-dom";
import axios from 'axios';
import Verification from '../../components/Verification/Verification'
import './Register.css'

const Register = () => {
  const [registrationData, setRegistrationData] = useState({ email: '', displayedName: '', password: '' })
  const [responseError, setResponseError] = useState({});
  const [responseMessage, setResponseMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();

    let newError = {};

    try {
      const url = 'http://localhost:3000/user/create'

      const response = await axios.post(url, {
        displayedName: registrationData.displayedName,
        email: registrationData.email,
        password: registrationData.password
      })
      setResponseMessage(response.data.message)

    } catch (err) {
      if (err.response.data.error.cause === 'input-fields')
        err.response.data.error.errors.map((fieldError) => {
          newError[fieldError.path] = fieldError.msg;
        })

    } finally {
      setResponseError(newError);
    }
  };
  useEffect(() => {
    console.log(responseError);
  })
  return (
    <div className="register-page">
      {(responseMessage) && <Verification
        responseMessage={responseMessage}
        setResponseMessage={setResponseMessage}
        setRegistrationData={setRegistrationData}>
      </Verification>}
      <div className='register-div' style={(responseMessage) ? { pointerEvents: 'none' } : {}}>
        <div style={{
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px'
        }}>

          <p style={
            {
              fontSize: '24px',
              color: 'white',
              fontWeight: '500'
            }
          }>
            Create an account
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className='label-input-div'>
              <label className="dot-label" htmlFor="email">
                EMAIL
              </label>
              {(responseError.email) &&
                <div className='error-container'>
                  {responseError.email}
                </div>
              }
              <input
                className={(responseError.email) && 'invalid-input'}
                type="text"
                id="email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData((prev) => { return { ...prev, email: e.target.value } })}
              />
            </div>
            <div className='label-input-div'>
              <label className="dot-label" htmlFor="displayedName">
                DISPLAYED NAME
              </label>
              {(responseError.displayedName) &&
                <div className='error-container'>
                  {responseError.displayedName}
                </div>
              }
              <input
                className={(responseError.displayedName) && 'invalid-input'}
                type="text"
                id="displayedName"
                value={registrationData.displayedName}
                onChange={(e) => setRegistrationData((prev) => { return { ...prev, displayedName: e.target.value } })}
              />
            </div>
            <div className='label-input-div'>
              <label className="dot-label" htmlFor="password">
                PASSWORD
              </label>
              {(responseError.password) &&
                <div className='error-container'>
                  {responseError.password}
                </div>
              }
              <input
                className={(responseError.password) && 'invalid-input'}
                type="password"
                id="password"
                value={registrationData.password}
                onChange={(e) => setRegistrationData((prev) => { return { ...prev, password: e.target.value } })}
              />
            </div>
          </div>
          <button type="submit">Continue</button>
          <Link style={{ color: '#44C2F8', fontSize: '14px', textDecoration: 'none' }} to='/login'>Already have an account?</Link>
        </form>
      </div>
    </div>
  )
}

export default Register