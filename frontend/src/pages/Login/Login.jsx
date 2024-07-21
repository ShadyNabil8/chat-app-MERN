import React, { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';

import './Login.css'

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [responseError, setResponseError] = useState({});
  const [responseMessage, setResponseMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = 'http://localhost:3000/user/login'

    let newError = {};

    try {
      await axios.get(url, {
        params: {
          email: loginData.email,
          password: loginData.password
        }
      })
    } catch (err) {
      if (!err.response.data.success) {

        const { cause, data } = err.response.data.error;

        if (cause === 'input-fields')
          data.map((fieldError) => {
            newError[fieldError.path] = fieldError.msg;
          });

        if (newError.hasOwnProperty('email')) {
          setLoginData({ email: '', password: '' })
        }
        else if (newError.hasOwnProperty('password')) {
          setLoginData((prev) => {
            return {
              email: prev.email,
              password: ''
            }
          })
        }
      }
    } finally {
      setResponseError(newError);
    }

  };
  return (
    <div className="login-page">
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
          <button type="submit">Login</button>
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