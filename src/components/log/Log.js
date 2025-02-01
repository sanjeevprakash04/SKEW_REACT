import './Log.css';
import React from 'react';

function Log(){
    return (
        <div className='log'>
            <div className="log-title-content">
                <h1 className="log-title">Log</h1>
                <div className="buttons">
                    <button className="b1">Clear</button>
                </div>
            </div>
            <hr></hr>
            <div className='log-view'>
                <p className="no-logs">No logs available</p>
            </div>
        </div>
    )
}

export default Log;