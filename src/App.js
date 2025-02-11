import './App.css';
import React,{ useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from './components/dashboard/Dashboard';
import Export from './components/export/Export';
import Log from './components/log/Log';
import About from './components/about/About';
import Settings from './components/settings/Settings';
import Help from './components/help/Help';
// import Launch from './components/launch/Launch';

function App(){
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    // const [isVerified, setIsVerified] = useState(false); // Reset verification on restart
    const [connection, setConnection] = useState({ driver:'0', ipAddress:'',});

    useEffect(() => {
        // Reset verification when the app starts (Removes stored verification)
        localStorage.removeItem("licenseVerified");
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // Callback function to set verification status
    // const handleVerification = () => {
    //     // localStorage.setItem("licenseVerified", "true"); // Store verification
    //     setIsVerified(true);
    // };

    const handleConnectionChange = (driver, ipAddress) => {
        setConnection({ driver, ipAddress });
    };

    return (
        <div className="app">
            {/* If not verified, show Launch component only */}
                {/* {!isVerified ? (
                <Routes>
                    <Route path="*" element={<Launch onVerify={handleVerification} />} />
                </Routes>
            ) : (
                <> */}
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar}
            />
            <main className={`main-content ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard connection={connection}/>} />
                    <Route path="/export" element={<Export />} />
                    <Route path="/log" element={<Log />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/settings" element={<Settings onConnectionChange={handleConnectionChange} />} />
                    <Route path="/help" element={<Help />} />
                </Routes>
            </main>
                {/* </>
            )} */}
        </div>
    );
}

export default App;