import React, { useContext, useState } from "react";
import { Typography, List, ListItem, ListItemText, AppBar, Toolbar, IconButton, Box, Tooltip, Modal, Backdrop, Button } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Logo1 from "./skew-logo-horizontal.png";
import Logo from './logo.png';
import { ThemeContext } from "../../context/ThemeContext";
import LoginPage from "../loginpage/LoginPage";

function StartPage({ onLogin }){
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const [openLogin, setOpenLogin] = useState(false);

    // Open login modal
    const handleLoginOpen = () => {
        setOpenLogin(true);
    };

    return (
        <>
        <AppBar
            position="fixed"
            color="inherit"
            sx={{
                height: 60,
                zIndex: 1201,
                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
                justifyContent: 'center'
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Left Section - Menu Icon & Logo */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: -1 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "inherit", borderRadius: 1, p: 1 }}>
                        <img src={Logo1} alt="Logo" style={{ height: 26, objectFit: "contain" }} />
                    </Box>
                </Box>

                {/* Right Section - Icons & Profile */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: -1 }}>
                    {/* Theme Toggle Button */}
                    <Tooltip 
                        title="Theme"
                        placement="bottom"
                        enterDelay={900}
                        arrow
                        slotProps={{
                            popper: {
                                modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                    offset: [0, -13],
                                    },
                                },
                                ],
                            },
                        }}
                    >
                        <IconButton onClick={toggleTheme} sx={{ color: "inherit" }}>
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip 
                        title="Help"
                        placement="bottom"
                        enterDelay={900}
                        arrow
                        slotProps={{
                            popper: {
                                modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                    offset: [0, -13],
                                    },
                                },
                                ],
                            },
                        }}
                    >
                        <IconButton sx={{ color: "inherit" }}>
                            <HelpIcon sx={{ fontSize: '26px' }}/>
                        </IconButton>
                    </Tooltip>
                    <Button variant="contained" color="primary" sx={{ textTransform: 'none', width: 100 }} onClick={handleLoginOpen}>
                        Log in
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>

        <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            pb: 2,
            mt: 8, 
            mx: 0.2, 
            height: "100vh", 
            width: '100%',
            textAlign: "center",
        }}>
            {/* Logo */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "inherit", borderRadius: 1, p: 1 }}>
                <img src={Logo} alt="Logo" style={{ width: 150, height: 150, objectFit: "cover" }} />
            </Box>

            {/* Content */}
            <Box sx={{ maxWidth: 1000, mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, mt: 1 }}>
                    Welcome to SKEW
                </Typography>
                <Typography sx={{ fontSize: 16, lineHeight: 1.6 }}>
                    SKEW is your ultimate solution for efficient data handling, analytics, and visualization from Programmable Logic Controllers (PLCs).
                </Typography>

                {/* Introduction */}
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                    Introduction:
                </Typography>
                <List sx={{ listStyleType: "none" }}>
                    {[
                    "⚡ SKEW is a cutting-edge software designed to streamline the process of fetching data from PLCs, empowering you to delve deep into your industrial operations...",
                    "⚡ Visualizing your data is made easy with SKEW's intuitive interface, allowing you to explore data in meaningful ways...",
                    "⚡ Experience the next level of PLC data management with SKEW. Revolutionize your operations, maximize efficiency, and unlock the full potential of your industrial processes."
                    ].map((text, index) => (
                    <ListItem key={index} sx={{ pl: 3.5, position: "relative", fontSize: 16, textAlign: 'center' }}>
                        <ListItemText primary={text} />
                    </ListItem>
                    ))}
                </List>

                {/* Who Can Benefit? */}
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                    Who Can Benefit?
                </Typography>
                <List sx={{ listStyleType: "none" }}>
                    {[
                        { label: "Manufacturers", text: "Streamline production processes, minimize downtime, and optimize resource utilization with real-time insights into equipment performance." },
                        { label: "Automation Engineers", text: "Enhance system performance and reliability by monitoring PLC data in real time and proactively addressing issues before they escalate." },
                        { label: "Plant Managers", text: "Gain visibility into plant operations, track key performance indicators, and make data-driven decisions to improve efficiency." },
                        { label: "Maintenance Teams", text: "Predict equipment failures, schedule preventive maintenance tasks, and ensure optimal equipment performance to minimize costly downtime." }
                    ].map((item, index) => (
                    <ListItem key={index} sx={{ pl: 3.5, position: "relative", fontSize: 16, textAlign: 'center' }}>
                        <ListItemText primary={<><strong>{item.label}:</strong> {item.text}</>} />
                    </ListItem>
                    ))}
                </List>

                {/* Contact Us */}
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                    Contact Us
                </Typography>
                <Typography sx={{ fontSize: 16, mb: 3 }}>
                    Email: <strong>info@proliteautomation.com</strong>
                </Typography>
            </Box>
        </Box>

        {/* Login Modal */}
        <Modal
            sx={{ zIndex: 1202, }}
            open={openLogin}
            onClose={() => setOpenLogin(false)}
            disableAutoFocus
            disableEnforceFocus
            closeAfterTransition
            slots={{ backdrop: Backdrop }} // ✅ Use slots for Backdrop
            slotProps={{
                backdrop: {
                    sx: { backdropFilter: "blur(10px)" }, // ✅ Use slotProps for styling
                },
            }}
        >
            <LoginPage 
                onLogin={onLogin}
                onClose={() => setOpenLogin(false)}
                title="Login" 
            />
        </Modal>
        </>
    );
};

export default StartPage;