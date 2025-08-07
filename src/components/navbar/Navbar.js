import /*React,*/ { useContext, useState } from "react";
import { Paper, AppBar, Toolbar, IconButton, Box, Tooltip, Menu, MenuItem, Avatar, Divider, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { AccountCircle, Logout } from "@mui/icons-material";
import Logo from "./skew-logo-horizontal.png";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { AppContext } from "../../context/AppContext";

function Navbar({ toggleSidebar, clearMessages, clearLogs }) {
    const { isConnected } = useContext(AppContext);
    const navigate = useNavigate();
    const { user, logoutUser } = useContext(AuthContext);
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        clearLogs();
        clearMessages();
        logoutUser();
        navigate("/home");
    };

    // Open user menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close user menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const getInitials = (email) => {
        if (!email) return "";
    
        const namePart = email.split("@")[0];
    
        const nameWords = namePart.split(/[.\-_]/);
    
        let initials = nameWords
            .filter(word => word.length > 0) // Remove empty parts
            .map(word => word[0].toUpperCase()) // Get first letter of each part
            .join(""); // Combine letters

        return initials || email[0].toUpperCase();
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
                    <Tooltip 
                        title="Menu"
                        placement="right-end"
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
                        <IconButton onClick={toggleSidebar} sx={{ color: 'inherit', minWidth: 0 }}>
                            <MenuIcon sx={{ fontSize: '26px' }} />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#fff", borderRadius: 1, p: 1 }}>
                        <img src={Logo} alt="Logo" style={{ height: 26, objectFit: "contain" }} />
                    </Box>
                </Box>

                {/* Right Section - Icons & Profile */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: -1 }}>
                    {/* Theme Toggle Button */}
                    <Tooltip 
                        title="Theme"
                        placement="bottom"
                        arrow
                        enterDelay={900}
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
                        title="Notification"
                        placement="bottom"
                        arrow
                        enterDelay={900}
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
                            <NotificationsIcon sx={{ fontSize: '26px' }}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip 
                        title="User"
                        placement="bottom"
                        arrow
                        enterDelay={900}
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
                        {user ? (
                            <IconButton onClick={handleMenuOpen}>
                                <Avatar
                                    // src={user.profilePicture || ""}
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        bgcolor: "#3f51b5", // Set color for logged-in users
                                        fontSize: "1rem",
                                        color: '#fff'
                                    }}
                                >
                                    {getInitials(user.email) || <AccountCircle sx={{ width: 30, height: 30 }} />}
                                </Avatar>
                            </IconButton> 
                        ) : null }
                    </Tooltip>
                    
                    {/* Menu Dropdown (Google Style) */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        slotProps={{
                            paper: {
                                elevation: 3,
                                sx: {
                                    borderRadius: 2,
                                    mt: 1,
                                    minWidth: 250,
                                    p: 1,
                                },
                            }
                        }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        {user ? (
                            <Box>
                                <Paper sx={{ p: 2, display: "flex", flexDirection:'column', justifyContent: 'center', alignItems: "center" }} elevation={0}>
                                    <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main", mb: 1 }}>
                                        {getInitials(user.email)}
                                    </Avatar>
                                    <Typography variant="body2" color="gray">{user.email}</Typography>
                                </Paper>

                                <Divider sx={{ my: 0.5 }} />
                                
                                <MenuItem onClick={handleLogout} disabled={isConnected}>
                                    <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                                </MenuItem>
                            </Box>
                        ) : null }
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        </>
    );
};

export default Navbar;
