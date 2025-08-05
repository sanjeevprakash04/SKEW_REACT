import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Launch from "./components/launch/Launch";
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import Export from './components/export/Export';
import Log from './components/log/Log';
import About from './components/about/About';
import Settings from './components/settings/Settings';
import Help from './components/help/Help';
import StartPage from './components/startpage/StartPage';
import UserManagement from './components/admin/UserManagement';
import SystemLogs from './components/admin/SystemLogs';
import ResetPassword from './components/auth/ResetPassword';
import EnergyMonitoring from './components/dashboard/EnergyMonitoring';
import DataMonitoring from './components/dashboard/DataMonitoring';

function App(){
    const { user, requiresPasswordReset, resetToken } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [isVerified, setIsVerified] = useState(false); // Reset verification on restart
    const [connection, setConnection] = useState({ driver:'0', ipAddress:''});
    const [message, setMessage] = useState([]);
    const [logs, setLogs] = useState(() => {
        return JSON.parse(localStorage.getItem("logs")) || [];
    });
    const [activeComponent, setActiveComponent] = useState('');
    const [tableData, setTableData] = useState([]);
    const [meterData, setMeterData] = useState({});

    const ws = useRef(null);  // WebSocket reference
    const logEndRef = useRef(null); // To scroll to the latest log

    const connectWebSocket = () => {
        if (ws.current) {
            ws.current.close(); // Close existing connection if any
        }

        ws.current = new WebSocket("ws://127.0.0.1:8000/ws");

        ws.current.onopen = () => {
            console.log("Connected to WebSocket");
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.msg) {
                    setLogs((prevLogs) => {
                        const newLogs = [...prevLogs, data.msg];
                        const latestLogs = newLogs.length > 100 ? newLogs.slice(-100) : newLogs;
                        
                        // Store logs in localStorage
                        localStorage.setItem("logs", JSON.stringify(latestLogs));
                        
                        return latestLogs;
                    });
                }
                if (data.dismsg) {
                    setLogs((prevLogs) => {
                        const newLogs = [...prevLogs, data.dismsg];
                        const latestLogs = newLogs.length > 100 ? newLogs.slice(-100) : newLogs;
                        
                        // Store logs in localStorage
                        localStorage.setItem("logs", JSON.stringify(latestLogs));
                        
                        return latestLogs;
                    });
                }
                if (data.data){
                    setTableData(data.data);
                }
                if (data.meterData){
                    setMeterData(data.meterData);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        ws.current.onclose = () => {
            console.log("WebSocket Disconnected");
        };
    };

    const disconnectWebSocket = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ action: "disconnect" })); // Notify backend
           
            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
    
                    if (data.dismsg) {
                        setLogs((prevLogs) => {
                            const newLogs = [...prevLogs, data.dismsg];
                            const latestLogs = newLogs.length > 100 ? newLogs.slice(-100) : newLogs;
                            localStorage.setItem("logs", JSON.stringify(latestLogs));
                            return latestLogs;
                        });
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
    
                ws.current.close();
                console.log("WebSocket Disconnected Manually");
            };
        }
    };

    const clearLogs = () => {
        setLogs([]);
        localStorage.removeItem("logs");
    };

    useEffect(() => {
        // Load messages from localStorage on mount
        const savedMessages = JSON.parse(localStorage.getItem("logMessages")) || [];
        setMessage(savedMessages);
    }, []);

    const addMessage = (newMessage) => {
        setMessage((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            localStorage.setItem("logMessages", JSON.stringify(updatedMessages)); // Save to localStorage
            return updatedMessages;
        });
    };

    const clearMessages = () => {
        setMessage([]); // Reset state
        localStorage.removeItem("logMessages"); // Clear storage
    };

    useEffect(() => {
        // Reset verification when the app starts (Removes stored verification)
        localStorage.removeItem("licenseVerified");
    }, []);



    const handleLogin = () => {
        setIsLoggedIn(true); // Set login status
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // Callback function to set verification status
    const handleVerification = () => {
        // localStorage.setItem("licenseVerified", "true"); // Store verification
        setIsVerified(true);
    };

    const handleConnectionChange = (driver, ipAddress) => {
        setConnection({ driver, ipAddress });
    };

    return (
        <AppProvider>
        <Router>
            <Box sx={{ display: "flex", justifyContent: 'center', height: "100vh", width: '100%', backgroundColor: "background.default" }}>

                {/* Show StartPage first */}'
                {requiresPasswordReset ? (
                    <Routes>
                        <Route path="*" element={<Navigate to={`/reset-password?token=${resetToken}`} />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                ) : !isLoggedIn ? (
                    <Routes>
                        <Route path="*" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<StartPage onLogin={handleLogin}/>} />
                    </Routes>
                ) : user?.role === 1 ? (
                    !isVerified ? (
                        <Routes>
                            <Route path="*" element={<Navigate to="/launch" />} />
                            <Route path="/launch" element={<Launch onVerify={handleVerification} />} />
                        </Routes>
                    ) : (
                    <>
                        <Navbar toggleSidebar={toggleSidebar} clearMessages={clearMessages} clearLogs={clearLogs}/>
                        <Sidebar 
                            isCollapsed={isSidebarCollapsed} 
                            toggleSidebar={toggleSidebar}
                            role={user?.role}
                        />
                        <Box
                            component="main"
                            sx={{
                                ml: "2px",
                                mr: "2px",
                                mt: "63px",
                                mb: "2px",
                                backgroundColor: "background.paper",
                                height: "calc(100vh - 66px)",
                                width: "100%",
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Routes>
                                <Route path="*" element={<Navigate to="/dashboard" />} />
                                <Route path="/dashboard" element={<Dashboard setActiveComponent={setActiveComponent}/>}/>
                                <Route path="dashboard/datamonitoring" element={<DataMonitoring
                                        connection={connection} addMessage={addMessage} 
                                        messages={message} connectWebSocket={connectWebSocket} 
                                        disconnectWebSocket={disconnectWebSocket} tableData={tableData} meterData={meterData}/>}
                                />
                                {activeComponent === 'monitor 1' && <Route path="dashboard/energymonitoring" element={<EnergyMonitoring title='Energy Monitoring Desk 1' meterData={meterData}/>}/>}
                                {activeComponent === 'monitor 2' && <Route path="dashboard/energymonitoring" element={<EnergyMonitoring title='Energy Monitoring Desk 2' meterData={meterData}/>}/>}
                                <Route path="/export" element={<Export />} />
                                <Route path="/log" element={<Log logs={logs} logEndRef={logEndRef} clearLogs={clearLogs}/>} />
                                <Route path="/about" element={<About />} />
                                <Route path="/settings" element={<Settings onConnectionChange={handleConnectionChange} />} />
                                <Route path="/help" element={<Help />} />
                                <Route element={<ProtectedRoute allowedRoles={[1]} />}>
                                    <Route path="/admin/users" element={<UserManagement role={user?.role}/>} />
                                    <Route path="/admin/logs" element={<SystemLogs />} />
                                </Route>
                            </Routes>
                        </Box>
                    </>
                    )
                ) : !isVerified ? ( /* After login, show Launch page for license verification */
                    <Routes>
                        <Route path="*" element={<Navigate to="/launch" />} />
                        <Route path="/launch" element={<Launch onVerify={handleVerification} />} />
                    </Routes>
                ) : (
                        <>
                        <Navbar toggleSidebar={toggleSidebar} clearMessages={clearMessages} clearLogs={clearLogs}/>
                        <Sidebar 
                            isCollapsed={isSidebarCollapsed} 
                            toggleSidebar={toggleSidebar}
                            role={user?.role}
                        />

                        {/* Main Content */}
                        <Box
                            component="main"
                            sx={{
                                ml: "2px",
                                mr: "2px",
                                mt: "63px",
                                mb: "2px",
                                backgroundColor: "background.paper",
                                height: "calc(100vh - 66px)",
                                width: "100%",
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Routes>
                                <Route path="*" element={<Navigate to="/dashboard" />} />
                                <Route path="/dashboard" element={<Dashboard activeComponent={activeComponent} setActiveComponent={setActiveComponent}/>}/>
                                <Route path="dashboard/datamonitoring" element={<DataMonitoring
                                        connection={connection} addMessage={addMessage} 
                                        messages={message} connectWebSocket={connectWebSocket} 
                                        disconnectWebSocket={disconnectWebSocket} tableData={tableData} meterData={meterData}/>}
                                />
                                {activeComponent === 'monitor 1' && <Route path="dashboard/energymonitoring" element={<EnergyMonitoring meterData={meterData}/>}/>}
                                {activeComponent === 'monitor 2' && <Route path="dashboard/energymonitoring" element={<EnergyMonitoring meterData={meterData}/>}/>}
                                <Route path="/export" element={<Export />} />
                                <Route path="/log" element={<Log logs={logs} logEndRef={logEndRef} clearLogs={clearLogs}/>} />
                                <Route path="/about" element={<About />} />
                                <Route path="/settings" element={<Settings onConnectionChange={handleConnectionChange} />} />
                                <Route element={<ProtectedRoute allowedRoles={[2]} />}>
                                    <Route path="/admin/users" element={<UserManagement role={user?.role}/>} />
                                    <Route path="/admin/logs" element={<SystemLogs />} />
                                </Route>
                                <Route path="/help" element={<Help />} />
                            </Routes>
                        </Box>
                        </>
                    )
                }
            </Box>
        </Router>
        </AppProvider>
    );
};

export default App;