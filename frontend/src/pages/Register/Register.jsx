import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link, redirect } from "react-router-dom";
import api from '../../api/api';
import MessageBox from '../../components/MessageBox/MessageBox'
import LoadingDots from '../../components/LoadingDots/LoadingDots'
import './Register.css'

const Register = () => {
  const [registrationData, setRegistrationData] = useState({ email: '', displayedName: '', password: '' })
  const [responseError, setResponseError] = useState({});
  const [responseMessage, setResponseMessage] = useState({ title: '', body: '' })
  const [messageBox, setMessageBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    setIsLoading(true);

    event.preventDefault();

    let newError = {};

    try {
      const url = 'user/register'

      const response = await api.post(url, {
        displayedName: registrationData.displayedName,
        email: registrationData.email,
        password: registrationData.password
      })

      setResponseMessage({
        title: 'Registiration successful',
        body: response.data.data
      })

      // setRegistrationData({ email: '', displayedName: '', password: '' });

      setMessageBox(true);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {

        const { cause, data } = err.response.data.error;

        if (cause === 'input-fields')
          data.map((fieldError) => {
            newError[fieldError.path] = fieldError.msg;
          })
        else {
          // Handle other error causes (e.g., server errors)
          setResponseMessage({
            title: 'Error',
            body: 'An error occurred while registering. Please try again later.'
          });
          setMessageBox(true);
        }
      }
      else {
        // Handle other errors (network issues, etc.)
        console.error('Registration error:', err);
        setResponseMessage({
          title: 'Error',
          body: 'An error occurred while registering. Please try again later.'
        });

        setMessageBox(true);
      }


    } finally {
      setIsLoading(false);
      setResponseError(newError);
    }
  };

  useEffect(() => {
    if (isRegistered) {
      navigate('/login')
    }
  }, [responseMessage])

  return (
    <div className="register-page">

      {(messageBox) && <MessageBox
        responseMessage={responseMessage}
        setResponseMessage={setResponseMessage}
        setMessageBox={setMessageBox}
        setIsRegistered={setIsRegistered}>
      </MessageBox>}

      <div className='register-div' style={(messageBox) ? { pointerEvents: 'none' } : {}}>
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
        {
          (isLoading) ?
            <LoadingDots></LoadingDots>
            : (
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
            )
        }
      </div>
    </div>
  )
}

export default Register