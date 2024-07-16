import React, { useState } from 'react'
import { Link } from "react-router-dom";
import './Register.css'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };
  return (
    <div className="register-page">
      <div className='register-div'>
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
              <label className="dot-label" htmlFor="username">
                EMAIL
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='label-input-div'>
              <label className="dot-label" htmlFor="displayname">
                DISPLAY NAME
              </label>
              <input
                type="text"
                id="displayname"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className='label-input-div'>
              <label className="dot-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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