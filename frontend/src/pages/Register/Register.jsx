import React, { useState, useEffect } from 'react'
import { Link, redirect } from "react-router-dom";
import axios from 'axios';
import './Register.css'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayedName, setDisplayedName] = useState('');
  const [responseError, setResponseError] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    let newError = {};

    try {
      const url = 'http://localhost:3000/user/create'
      await axios.post(url, {
        displayedName: displayedName,
        email: email,
        password: password
      })
    } catch (err) {
      // console.log(err.response.data.errors);
      err.response.data.errors.map((fieldError) => {
        newError[fieldError.path] = true;
      })
      // console.error('Error creating user:', err);
    } finally {
      setResponseError(newError);
    }
  };
  useEffect(() => {
    console.log(responseError);
  })
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
              <label className="dot-label" htmlFor="email">
                EMAIL
              </label>
              {(responseError.email) &&
                <div className='error-container'>
                  MAke sure that email is valid
                </div>
              }
              <input
                className={(responseError.email) && 'invalid-input'}
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='label-input-div'>
              <label className="dot-label" htmlFor="displayedName">
                DISPLAYED NAME
              </label>
              {(responseError.displayedName) &&
                <div className='error-container'>
                  Displayed name must be at least 3 characters
                </div>
              }
              <input
                className={(responseError.displayedName) && 'invalid-input'}
                type="text"
                id="displayedName"
                value={displayedName}
                onChange={(e) => setDisplayedName(e.target.value)}
              />
            </div>
            <div className='label-input-div'>
              <label className="dot-label" htmlFor="password">
                PASSWORD
              </label>
              {(responseError.password) &&
                <div className='error-container'>
                  Minimum eight characters, at least one letter, one number and one special character:
                </div>
              }
              <input
                className={(responseError.password) && 'invalid-input'}
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