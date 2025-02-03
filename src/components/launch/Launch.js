import './Launch.css';
import React, { useState } from "react";
import Logo from './logo.png';
import axios from "axios";

function Launch(/*{ onVerify }*/) {
    // const [licenseKey, setLicenseKey] = useState("");

    // const handleActivate = () => {
    //     if (licenseKey.trim() === "VALID-KEY") { // Replace with actual verification logic
    //         localStorage.setItem("licenseVerified", "true");
    //         onVerify();
    //     } else {
    //         alert("Invalid License Key. Please try again.");
    //     }
    // };

    return (
        <div className="launch-container">
            <div className="launch-card">
                <img src={Logo} alt="SKEW Logo" className="logo" /> 
                <h1 className="title">Welcome</h1>

                <button className="launch-button" onClick={handleLaunch}>Launch</button>
                <p className="launch-text">Click to launch</p>

                <div className="license-section">
                    <label htmlFor="licenseKey">Enter License Key:</label>
                    <input
                        type="text"
                        id="licenseKey"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        placeholder="Enter License Key..."
                    />
                    <button className="activate-button" onClick={handleActivate}>Activate</button>
                </div>
            </div>
        </div>
    );
}

export default Launch;
