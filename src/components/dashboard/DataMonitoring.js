import { Box, Stack, useMediaQuery, CircularProgress, Button, Typography, Divider, Paper } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import BarChartComp from "../barchart/BarChartComp";
import LiveTable from "../table/Livetable";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { AppContext } from "../../context/AppContext";
import { useTheme } from '@mui/material/styles';

function DataMonitoring({connection, addMessage, messages, connectWebSocket, disconnectWebSocket, tableData, meterData}) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const {isConnected, setIsConnected} = useContext(AppContext);
    const {user} = useContext(AuthContext);
    const [message, setMessage] = useState([messages]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem("logMessages")) || [];
        setMessage(savedMessages);
    }, []);

    // Update local state whenever `addMessage` modifies the log storage
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem("logMessages")) || [];
        setMessage(savedMessages);
    }, [addMessage]);

    useEffect(() => {
        const fetchBarGraphData = async () => {
            try {
                const response = await axios.post("http://127.0.0.1:8000/bar-graph", {
                    headers: { "Content-Type": "application/json" },
                });
                setData(response.data); // Assuming response.data is an array
            } catch (error) {
                alert("Error fetching data");
            }
        };
    
        fetchBarGraphData();
    }, []);

    // Adjust size dynamically based on screen width
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const progressSize = isSmallScreen ? 100 : 150; // Smaller size for mobile

    const handleClickConnect = async () => {
        connectWebSocket();
        try {
            const response = await axios.post("http://127.0.0.1:8000/plc-connect", {
                ip: connection.ipAddress,  // Send IP Address
                driver: connection.driver, // Send selected driver
            });
            addMessage(response.data.message);
            // Update the local state immediately
            setMessage((prevMessages) => [...prevMessages, response.data.message]);
            setIsConnected(true);
        } catch (error) {
            const errorMessage = "Error connecting to PLC: " + (error.response?.data?.error || error.message);
            addMessage(errorMessage);
            // Update the local state immediately
            setMessage((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    const handleClickDisconnect = async () => {
        disconnectWebSocket();
        try {
            const response = await axios.post("http://127.0.0.1:8000/plc-disconnect");
            addMessage(response.data.message);
            // Update the local state immediately
            setMessage((prevMessages) => [...prevMessages, response.data.message]);
            setIsConnected(false);
        } catch (error) {
            const errorMessage = "Error disconnecting from PLC: " + (error.response?.data?.error || error.message);
            addMessage(errorMessage);
            // Update the local state immediately
            setMessage((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh', bgcolor: isDarkMode ? "#333" : "#f4f6f8" }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    Data Desk
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" disabled={user.role > 3 || isConnected} color="primary" sx={{ width: '120px' }} onClick={handleClickConnect}>
                        Connect
                    </Button>
                    <Button variant="contained" disabled={user.role > 3 || !isConnected} color="primary" sx={{ width: '120px' }} onClick={handleClickDisconnect}>
                        Disconnect
                    </Button>
                </Box>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />
            
            {/* Widgets Section */}
            <Box display="flex" flexDirection="column" mt={0.5} height="calc(100vh - 130px)" gap={0.5}>
                {/* Upper Widgets */}
                <Box display="flex" height="calc(50vh - 70px)" gap={0.5}>
                    <Paper sx={{ width: '50%', height:'100%', display: "flex", flexDirection: "column", boxShadow:'none' }}>
                        <Typography variant="subtitle1" ml={0.3}>Bar Chart</Typography>
                        <Box width='100%' height='100%' overflow="hidden" border={1} borderColor="#ddd" borderRadius={1} p={1}>
                            <BarChartComp data={data}/>
                        </Box>
                    </Paper>
                    <Paper sx={{ width: '50%', height:'100%', display: "flex", flexDirection: "column", boxShadow:'none' }}>
                        <Typography variant="subtitle1" ml={0.3}>Data Meter</Typography>
                        <Box
                            height="100%"
                            width="100%"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            overflow="hidden"
                            border={1}
                            borderColor="#ddd"
                            borderRadius={1}
                            p={2}
                        >
                            <Stack direction="row" spacing={4} flexWrap="wrap" justifyContent="center">
                                {Object.entries(meterData).filter(([key]) => ['Voltage4', 'Current4', 'PowerKW4'].includes(key)).map(([key, value], index) => {
                                    // Define max values for normalization
                                    const maxValues = {
                                        Voltage4: 1000,   // 100% = 400V
                                        Current4: 50,    // 100% = 10A
                                        PowerKW4: 20      // 100% = 1kW
                                    };

                                    // Calculate percentage (ensure it's within 0-100%)
                                    const percentage = Math.min(Math.max((value / (maxValues[key] || 100)) * 100, 0), 100);

                                    return (
                                        <Stack key={index} alignItems="center">
                                            <Box position="relative" display="inline-flex">
                                            <CircularProgress
                                                variant="determinate"
                                                value={100} // Always full
                                                size={progressSize}
                                                thickness={8}
                                                sx={{ color: isDarkMode ? "#444" : "#E0E0E0" }} // Light gray background
                                            />
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    size={progressSize}
                                                    thickness={8}
                                                    sx={{
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                        color: isDarkMode ? "#005da2": "#005da2",
                                                    }}
                                                />
                                                <Box
                                                    top={0}
                                                    left={0}
                                                    bottom={0}
                                                    right={0}
                                                    position="absolute"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexDirection="column"
                                                >
                                                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                        {value} {/* Show actual value */}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {/* Label Below CircularProgress */}
                                            <Typography variant="body1" color="text.secondary" fontWeight="bold" fontSize={17} mt={2}>
                                                {key}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </Paper>
                </Box>

                {/* Lower Widgets */}
                <Box display="flex" height="calc(50vh - 70px)" gap={0.5}>
                    <Paper sx={{ width: '50%', height:'100%', display: "flex", flexDirection: "column", boxShadow:'none' }}>
                        <Typography variant="subtitle1" ml={0.3}>Log Details</Typography>
                        <Box 
                            width='100%' 
                            height='100%'
                            overflow="auto" 
                            border={1} 
                            borderColor="#ddd" 
                            borderRadius={1} 
                            p={1}
                        >
                            {message.map((msg, index) => (
                                <Typography key={index} fontSize={15}>
                                    {msg}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                    <Paper sx={{ width: '50%', height: '100%',display: "flex", flexDirection: "column", boxShadow: 'none' }}>
                        <Typography variant="subtitle1" ml={0.3}>Data Table</Typography>
                        <Box 
                            width='100%' 
                            height='100%'
                            overflow="auto" 
                            border={1} 
                            borderColor="#ddd" 
                            borderRadius={1}
                        >
                            <LiveTable data={tableData} />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default DataMonitoring;