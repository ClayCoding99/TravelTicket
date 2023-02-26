import React from 'react'
import "./css/notFound.css";

export function NotFound() {

    function returnHome() {
        window.location.href = './';
    }

    return (
        <div className="not-found-container"> 
            <h1>Nothing Here</h1>
            <button onClick={returnHome}>Return Home</button>
        </div>
    )
}
