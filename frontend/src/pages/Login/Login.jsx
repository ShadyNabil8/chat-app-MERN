import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import MessageBox from '../../components/MessageBox/MessageBox'
import { useAuth } from '../../context/authContext';
import LoadingDots from '../../components/LoadingDots/LoadingDots'

import './Login.css'

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [responseError, setResponseError] = useState({});
  const [responseMessage, setResponseMessage] = useState({ title: '', body: '' })
  const [messageBox, setMessageBox] = useState(false);
  const { login, setAuthState, authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    setIsLoading(true);

    event.preventDefault();

    let newError = {};

    try {
      const { email, password } = loginData;

      await login(email, password);

    } catch (err) {

      setAuthState({
        isAuthenticated: false,
        userData: {
          displayedName: '',
          email: '',
          profilePicture: '',
          friends: []
        }
      })

      if (err.response && err.response.data && !err.response.data.success) {
        const { cause, data } = err.response.data.error;

        if (cause === 'input-fields') {

          data.map((fieldError) => {
            newError[fieldError.path] = fieldError.msg;
          });


          setLoginData((prev) => ({
            ...prev,
            email: newError.hasOwnProperty('email') ? '' : prev.email,
            password: ''
          }));

        }

        else if (cause === 'verification') {

          setResponseMessage({
            title: 'Verification required',
            body: data
          })

          setLoginData((prev) => ({
            ...prev,
            email: prev.email,
            password: ''
          }));

          setMessageBox(true);
        }
      }
      else {

        // Handle other errors (network issues, server errors, etc.)
        console.error('Login error:', err);
        setResponseMessage({
          title: 'Error',
          body: 'An error occurred while logging in. Please try again later.'
        });

        setMessageBox(true);
      }
    } finally {
      setResponseError(newError);
      setIsLoading(false);
    }

  };

  return (
    <div className="login-page">

      {(messageBox) && <MessageBox
        responseMessage={responseMessage}
        setResponseMessage={setResponseMessage}
        setMessageBox={setMessageBox}>
      </MessageBox>}

      <div className='login-div'>
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
            Welcome back!
          </p>

          <p style={
            {
              color: '#B5BAC1'
            }
          }>
            We're so excited to see you again!
          </p>

        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className='label-input-div'>
              <label htmlFor="username">
                EMAIL:
              </label>
              {(responseError.email) &&
                <div className='error-container'>
                  {responseError.email}
                </div>
              }
              <input
                type="text"
                id="username"
                value={loginData.email}
                onChange={(e) => setLoginData((prev) => { return { ...prev, email: e.target.value } })}
              />
            </div>
            <div className='label-input-div'>
              <label htmlFor="password">
                PASSWORD:
              </label>
              {/* {(responseError.password) &&
                <div className='error-container'>
                  {responseError.password}
                </div>
              } */}
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData((prev) => { return { ...prev, password: e.target.value } })}
              />
            </div>
          </div>
          <Link style={{ color: '#44C2F8', border: '0px', textDecoration: 'none' }}>Forget your password?</Link>
          <button type="submit"  style={(isLoading) ? { pointerEvents: 'none' } : {}}>{(isLoading) ? <LoadingDots></LoadingDots> : "Login"}</button>
          <div style={{ display: 'flex', gap: '5px' }}>
            <p style={{ color: '#B5BAC1', fontSize: '14px' }}>Need an account?</p>
            <Link style={{ color: '#44C2F8', fontSize: '14px', textDecoration: 'none' }} to='/register'>register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login