import React from 'react'
import './LoadingDots.css'

const LoadingDots = ({ style }) => {
    return (
        <div className="loading-dots" style={(style) && style}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    )
}

export default LoadingDots
