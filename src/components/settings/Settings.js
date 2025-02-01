import './Settings.css';
import React from 'react';

function Settings(){
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
                                <select className="dropdown">
                                    <option value="1">OPC Server</option>
                                    <option value="2">Siemens S7 1200/1500 TCP/IP Ethernet</option>
                                    <option value="3">Siemens S7 200 TCP/IP Ethernet</option>
                                    <option value="4">Siemens S7 300/400 TCP/IP Ethernet</option>
                                    <option value="5">Modbus TCP</option>
                                </select>
                            </div>
                            <div className='lower'>
                                <span>Specify the Node or Driver specific station</span>
                                <input placeholder='Enter IP Address'/>
                            </div>
                        </div>
                    </div>
                    <div className="widget">
                        <span>Configure data</span>
                        <div className="data-view">
                            <div className='upper'>
                                <span>Import the new PLC Data Configuration</span>
                                <button>Import</button>
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
                                <input placeholder='Enter Report Name'/>
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
    )
}

export default Settings;