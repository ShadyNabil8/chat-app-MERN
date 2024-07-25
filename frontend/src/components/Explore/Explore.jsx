import React from 'react'
import './Explore.css'

const Explore = ({ children, handleOnChange }) => {
    return (
        <div className="explore-container">
            <div className="search-bar">
                <input type='text' placeholder='Search for friends' onChange={(e) => handleOnChange(e.target.value)}></input>
            </div>
            <div className="explore-elements-container">
                {children}
            </div>
        </div>
    )
}

export default Explore
