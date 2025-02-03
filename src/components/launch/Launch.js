import './Launch.css';
import React, { useState } from "react";
import Logo from './logo.png';
import axios from "axios";

function Launch({ onVerify }) {
    const [licenseKey, setLicenseKey] = useState("");

    // Handle license activation
    const handleActivate = async () => {
        try {
            console.log(licenseKey.trim());
            const response = await axios.post("http://127.0.0.1:8000/get-data", {
                
                styEnckey: licenseKey
            });

            alert(response.data);
        } catch (err) {
            console.error("Error connecting to API.", err);
        }
    };

    const handleLaunch = async () => {
        try {
            console.log("NONE", licenseKey.trim() || "No key provided");

            const response = await axios.post("http://127.0.0.1:8000/open-window", {
                
                styEnckey: licenseKey.trim()
            });
            console.log("NONE", response.data.retmsg);

            if (response.data.retmsg === true) {
                // localStorage.setItem("licenseVerified", "true");
                onVerify();
            } else {
                alert("Invalid License Key. Please try again.");
            }
        } catch (err) {
            console.error("Error connecting to API.", err);
        }
    };

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
