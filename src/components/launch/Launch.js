import /*React,*/ { useState, useContext } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Logo from "./logo.png";
import axios from "axios";

function Launch({ onVerify }) {
    const [licenseKey, setLicenseKey] = useState("");
    const { darkMode, toggleTheme } = useContext(ThemeContext);

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

            if (response.data.retmsg === true) { // Replace with actual verification logic
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
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100vh" 
            bgcolor="background.default"
            color="text.primary"
        >
            <Paper 
                elevation={3} 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                    textAlign: "center",
                    maxWidth: 600,
                    width: "100%",
                    borderRadius: 3,
                    position: "relative",
                    bgcolor: "background.paper",
                }}
            >
                {/* Theme Toggle Button */}
                <IconButton 
                    onClick={toggleTheme} 
                    sx={{ position: "absolute", top: 10, right: 10 }}
                >
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>

                {/* Logo */}
                <Box display="flex" justifyContent="center" bgcolor="#fff" borderRadius={1} width={155} height={155}> 
                    <img src={Logo} alt="SKEW Logo" style={{ width: 150, height: 150 }} />
                </Box>

                <Typography variant="h3" mt={2} style={{ fontSize: '30px' }}>
                    Welcome
                </Typography>

                <Button 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 2, py: 1.5, width: '200px'  }}
                    onClick={handleLaunch}
                >
                    Launch
                </Button>
                <Typography variant="body2" color="textSecondary" mt={1} fontSize={16}>
                    Click to launch
                </Typography>

                {/* License Key Input */}
                <Box mt={2}>
                    <Typography variant="subtitle1" align="left" ml={1}>
                        Enter License Key:
                    </Typography>
                    <div style={{ display: "flex", gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                        <TextField
                            variant="outlined"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            placeholder="Enter License Key..."
                            autoComplete="off"
                            sx={{ width: 400 }}
                            slotProps={{
                                input: {sx: { height: 45, fontSize: 15 }},  // Adjust height & text size
                            }}
                        />
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            sx={{ py: 1.2, height: 45, width: 120 }}
                            onClick={handleActivate}
                        >
                            Activate
                        </Button>
                    </div>
                </Box>
            </Paper>
        </Box>
    );
};

export default Launch;
