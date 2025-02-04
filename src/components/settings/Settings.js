import './Settings.css';
import React, { useState, useRef } from 'react';
import axios from "axios";

function Settings({ onConnectionChange }) {
    const [driver, setDriver] = useState('0');
    const [ipAddress, setIpAddress] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);

    const handleDriverChange = (event) => {
        const newDriver = event.target.value;
        setDriver(newDriver);
        onConnectionChange(newDriver, ipAddress);
    };

    const handleIpChange = (event) => {
        const newIp = event.target.value;
        setIpAddress(newIp);
        onConnectionChange(driver, newIp); // Send data to App.js
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);  // Update the selected file
            handleUpload(selectedFile);  // Upload the file immediately
        }
    };

    const handleUpload = async (fileToUpload) => {
        if (!fileToUpload) {
            setMessage("Please select an Excel file.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("driver", driver);  // Include driver in the request
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/upload-excel", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            console.log("Upload Response:", response.data);
            setMessage(response.data.message || "File uploaded successfully!");
        } catch (error) {
            console.error("Upload Error:", error);
            setMessage("Error uploading file: " + (error.response?.data?.error || error.message));
        }
    };
    

    const handleImportClick = () => {
        if (file) {
            handleUpload(file); // If file is already selected, upload it
        } else {
            fileInputRef.current.click(); // Otherwise, open file picker
        }
    };

    return (
        <div className="settings">
            <div className="settings-title-content">
                <h1 className="settings-title">Settings</h1>
            </div>
            <hr></hr>
            <div className="settings-widgets">
                <div className="widget-upper">
                    <div className="widget">
                        <span>Configure Connection</span>
                        <div className="connection-view">
                            <div className='upper'>
                                <span>Select the Connection Driver</span>
                                <select className="dropdown" value={driver} onChange={handleDriverChange}>
                                    <option value="0">OPC Server</option>
                                    <option value="1">Siemens S7 1200/1500 TCP/IP Ethernet</option>
                                    <option value="2">Siemens S7 200 TCP/IP Ethernet</option>
                                    <option value="3">Siemens S7 300/400 TCP/IP Ethernet</option>
                                    <option value="4">Modbus TCP</option>
                                </select>
                            </div>
                            <div className='lower'>
                                <span>Specify the Node or Driver specific station</span>
                                <input placeholder='Enter IP Address' value={ipAddress} onChange={handleIpChange} />
                            </div>
                        </div>
                    </div>
                    <div className="widget">
                        <span>Configure data</span>
                        <div className="data-view">
                            <div className='upper'>
                                <span>Import the new PLC Data Configuration</span>
                                {/* Hidden file input */}
                                <label className="import-button">
                                    <input
                                        type="file"
                                        accept=".xls,.xlsx"
                                        ref={fileInputRef}  // Reference to trigger file selection
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    {/* Import button */}
                                    <button onClick={handleImportClick}>Import</button>
                                </label>
                            </div>
                            <div className='lower'>
                                <span>For Reference, Export the PLC Data Configurable file</span>
                                <button>Export</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="widget-lower">
                    <div className="widget">
                        <span>General Settings</span>
                        <div className="settings-view">
                            <div className='upper'>
                                <span>Enter Email Id</span>
                                <input placeholder='Enter Email Id' />
                                <button>Set Email</button>
                            </div>
                            <div className='lower'>
                                <span>Report Name</span>
                                <input placeholder='Enter Report Name' />
                                <button>Set Name</button>
                            </div>
                        </div>
                    </div>
                    <div className="widget">
                        <span>Database Backup</span>
                        <div className="database-view">
                            <span>Save Database Backup</span>
                            <button>Save</button>
                        </div>
                    </div>
                </div>
                <div className='settings-log-view'>
                    <div className='widget'>
                        <span>Log Details</span>
                        <div className='logdata-view'>
                            <p>No logs to display</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;