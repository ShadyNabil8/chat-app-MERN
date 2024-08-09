import React from 'react'
import './Hint.css'
const Hint = ({hint}) => {
    return (
        <div className={`hint-container ${hint ? 'visible' : ''}`}>
            {hint}
        </div>
    )
}

export default Hint
