import React, { useState, useRef, useContext } from "react";
import { Box, Typography, Divider, Paper, Select, MenuItem, TextField, Button } from "@mui/material";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";

function Settings({ onConnectionChange }) {
    const { user } = useContext(AuthContext);
    const { initialValues, isConnected } = useContext(AppContext);
    const [driver, setDriver] = useState('2');
    const [ipAddress, setIpAddress] = useState(initialValues.ip);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("No logs to display");
    const fileInputRef = useRef(null);
    const [email, setEmail] = useState(initialValues.mailid);
    const [reportName, setReportName] = useState(initialValues.name);

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

    const exportDemoData = async () => {
        try {
            // Send request to FastAPI
            const response = await axios.get("http://127.0.0.1:8000/export-demo-data", {
                responseType: "blob", // Expect binary data
            });
    
            // Create a Blob from the response
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
            // Create a link element
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Reference_Data.xlsx";
    
            // Append to DOM and trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            alert("File downloaded successfully!");
        } catch (error) {
            console.error("Error exporting data:", error);
        }
    };

    const handleImportClick = () => {
        if (file) {
            handleUpload(file); // If file is already selected, upload it
        } else {
            fileInputRef.current.click(); // Otherwise, open file picker
        }
    };

    const handleEmailSend = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/send-email", null, {
              params: { email: email }, // Send email as query parameter
            });
            console.log("Email Response:", response.data);
            setMessage(response.data.message);
          } catch (error) {
            console.log("Email Error:", error);
            setMessage(error.response?.data?.detail || "Error sending email");
        }
    }

    return (
        
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    Settings
                </Typography>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />
            
            {/* Widgets Section */}
            <Box display="flex" flexDirection="column" gap={0.5} mt={0.5} height="calc(70vh - 100px)">
                {/* Upper Widgets */}
                <Box display="flex" height="calc(40vh - 80px)" gap={0.5}>
                    <Paper sx={{ display: "flex", flexDirection: "column", boxShadow: 'none', width: '50%' }}>
                        <Typography variant="subtitle1" ml={0.3}>Connection Configuration</Typography>
                        <Box
                            width="100%"
                            height="calc(40vh - 130px)"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            overflow="auto"
                            border={1}
                            borderColor="#ddd"
                            borderRadius={1}
                            p={1}
                            gap={2}
                        >
                            {/* Select Box with Label (Aligned Vertically) */}
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "50px", gap: 14, px: 8, }}>
                                <Typography sx={{ minWidth: "200px" }}>Select the Connection Driver</Typography>
                                <Select
                                    size="small"
                                    variant="outlined"
                                    value={driver}
                                    onChange={handleDriverChange}
                                    disabled={user.role > 3 || isConnected}
                                    sx={{
                                        width: "250px",
                                        height: "50px",  // Ensure both inputs have the same height
                                        "& .MuiSelect-select": {
                                            display: "block",
                                            whiteSpace: "nowrap", // Enables wrapping
                                            overflow: "hidden", // Hides overflowing content
                                            textOverflow: "ellipsis",
                                            alignItems: "center",
                                            fontSize: 14,
                                            height: "100%",  // Stretches fully inside the container
                                        },
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="0" sx={{ fontSize: 14 }}>OPC Server</MenuItem>
                                    <MenuItem value="1" sx={{ fontSize: 14 }}>AB Control & Compactlogix TCP/IP Ethernet</MenuItem>
                                    <MenuItem value="2" sx={{ fontSize: 14 }}>Siemens S7 1200/1500 TCP/IP Ethernet</MenuItem>
                                    <MenuItem value="3" sx={{ fontSize: 14 }}>Siemens S7 200 TCP/IP Ethernet</MenuItem>
                                    <MenuItem value="4" sx={{ fontSize: 14 }}>Siemens S7 300/400 TCP/IP Ethernet</MenuItem>
                                    <MenuItem value="5" sx={{ fontSize: 14 }}>Modbus TCP</MenuItem>
                                </Select>
                            </Box>

                            {/* TextField with Label (Aligned Vertically) */}
                            <Box sx={{ display: "flex",  justifyContent: "center", alignItems: "center", width: "100%", height: "50px", gap: 2, px: 8, }}>
                                <Typography sx={{ minWidth: "200px" }}>Specify the Node or Driver specific station</Typography>
                                <TextField
                                    placeholder="Enter IP Address"
                                    value={ipAddress}
                                    onChange={handleIpChange}
                                    disabled={user.role > 3  || isConnected}
                                    sx={{
                                        flexShrink: 'none',
                                        width: "250px",
                                        height: "50px",  // Ensure both inputs have the same height
                                        "& input": { height: "100%", fontSize: 14 },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ width: '50%', display: "flex", flexDirection: "column", boxShadow:'none' }}>
                        <Typography variant="subtitle1" ml={0.3}>Configure Data</Typography>
                        <Box 
                            width= '100%'
                            height= 'calc(40vh - 130px)'
                            border={1} 
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            overflow="auto" 
                            borderColor="#ddd" 
                            borderRadius={1} 
                            p={1}
                            gap={2}
                            sx={{
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: 7 }}>
                                <Typography>Import the new PLC Data Configuration</Typography>
                                <Button variant="contained" disabled={user.role > 3  || isConnected} color="primary" sx={{ width: '140px', height: 45 }} onClick={handleImportClick}>
                                    Import
                                </Button>
                                <input
                                    type="file"
                                    accept=".xls,.xlsx"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", gap: 8.5 }}>
                                <Typography>Export the PLC Data Configurable file</Typography>
                                <Button variant="contained" disabled={user.role > 3  || isConnected} color="primary" sx={{ width: '140px', height: 45 }} onClick={exportDemoData}>Export</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Lower Widgets */}
                <Box display="flex" height="calc(40vh - 80px)" gap={0.5}>
                    <Paper sx={{ width: '50%', display: "flex", flexDirection: "column", boxShadow:'none' }}>
                        <Typography variant="subtitle1" ml={0.3}>General Settings</Typography>
                        <Box 
                            width= '100%'
                            height= 'calc(40vh - 130px)' 
                            display="flex" 
                            flexDirection="column" 
                            justifyContent='center'
                            overflow="auto" 
                            border={1} 
                            borderColor="#ddd" 
                            borderRadius={1} 
                            p={1}
                            sx={{
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography>Enter Email Id</Typography>
                                    <TextField 
                                        flex={1}
                                        type="email"
                                        placeholder="Enter Email Id" 
                                        value={email}
                                        disabled={user.role > 3}
                                        onChange={(e) => setEmail(e.target.value)}
                                        sx={{ flex: 1 }} 
                                        slotProps={{
                                            input: {
                                                sx: {height: 45, fontSize: 14 }
                                            }
                                        }}
                                    />
                                    <Button variant="contained" disabled={user.role > 3} color="primary" sx={{ width: '140px', height: 45 }} onClick={handleEmailSend}>Set Email</Button>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography>Report Name</Typography>
                                    <TextField 
                                        flex={1}
                                        value={reportName}
                                        disabled={user.role > 3}
                                        placeholder="Enter Report Name" 
                                        onChange={(e) => setReportName(e.target.value)}
                                        sx={{ flex: 1, ml: 0.73 }} 
                                        slotProps={{
                                            input: {
                                                sx: {height: 45, fontSize: 14 }
                                            }
                                        }}
                                    />
                                    <Button variant="contained" color="primary" disabled={user.role > 3} sx={{ width: '140px', height: 45 }}>Set Name</Button>
                                </Box>
                            </Box>       
                        </Box>
                    </Paper>
                    <Paper sx={{ width: '50%', display: "flex", flexDirection: "column", boxShadow: 'none' }}>
                        <Typography variant="subtitle1" ml={0.3}>Database Backup</Typography>
                        <Box 
                            width= '100%'
                            height= 'calc(40vh - 130px)' 
                            display="flex" 
                            flexDirection="column" 
                            justifyContent='center'
                            border={1} 
                            overflow="auto" 
                            borderColor="#ddd" 
                            borderRadius={1} 
                            p={1}
                            sx={{
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', gap: 20.5 }}>
                                <Typography>Save Database Backup</Typography>
                                <Button variant="contained" color="primary" disabled={user.role > 3} sx={{ width: '140px', height: 45 }}>Save</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            
            <Paper sx={{ width: '100%', mt: 0.5, display: "flex", flexDirection: "column", boxShadow:'none', height:"calc(30vh - 35px)" }}>
                <Typography variant="subtitle1" ml={0.3}>Log Details</Typography>
                <Box 
                    flex={1} 
                    overflow="auto" 
                    border={1} 
                    borderColor="#ddd" 
                    borderRadius={1} 
                    p={1}
                    pl={1.5}
                >
                    <Typography fontSize={15}>{message}</Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Settings;
