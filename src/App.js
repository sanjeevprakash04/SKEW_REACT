import './App.css';
import React,{ useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from './components/dashboard/Dashboard';
import Export from './components/export/Export';
import Log from './components/log/Log';
import About from './components/about/About';
import Settings from './components/settings/Settings';
import Help from './components/help/Help';

import Launch from './components/launch/Launch';

function App(){
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [isVerified, setIsVerified] = useState(false); // Reset verification on restart
    const [driver, setDriver] = useState('');
    const [address, setAddress] = useState('');
    const [connection, setConnection] = useState([]);

    useEffect(() => {
        // Reset verification when the app starts (Removes stored verification)
        localStorage.removeItem("licenseVerified");
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // Callback function to set verification status
    const handleVerification = () => {
        // localStorage.setItem("licenseVerified", "true"); // Store verification
        setIsVerified(true);
    };

    //
    const handleDropdownSubmit = (connDriver)=>{
        setDriver(connDriver)
    }

    const handleInputSubmit = (ip)=>{
        setAddress(ip);
    }

    const handleConnection = ()=>{
        const result = [driver, address];
        setConnection(result);
        return connection;
    }

    return (
        <Router>
            <div className="app">
                {/* If not verified, show Launch component only */}
                 {!isVerified ? (
                    <Routes>
                        <Route path="*" element={<Launch onVerify={handleVerification} />} />
                    </Routes>
                ) : (
                    <>
                <Navbar toggleSidebar={toggleSidebar} />
                <Sidebar 
                    isCollapsed={isSidebarCollapsed} 
                    toggleSidebar={toggleSidebar}
                />
                <main className={`main-content ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<Dashboard onSubmit={handleConnection}/>} />
                        <Route path="/export" element={<Export />} />
                        <Route path="/log" element={<Log />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/settings" element={<Settings onInputSubmit={handleInputSubmit} onDropdownSubmit={handleDropdownSubmit} />} />
                        <Route path="/help" element={<Help />} />
                    </Routes>
                </main>
                    </>
                ) }
            </div>
        </Router>
    );
}

export default App;