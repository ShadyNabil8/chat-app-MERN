import React, { useState } from 'react'
import { Link } from "react-router-dom";

import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Username:', username);
    console.log('Password:', password);
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
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='label-input-div'>
              <label htmlFor="password">
                PASSWORD:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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