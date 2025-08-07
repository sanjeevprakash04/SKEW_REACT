// import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpIcon from "@mui/icons-material/Help";

function Sidebar({ isCollapsed, role }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { path: "/export", label: "HistoricalData", icon: <AssessmentIcon /> },
        { path: "/log", label: "Log", icon: <DescriptionIcon /> },
        { path: "/about", label: "About", icon: <InfoIcon /> },
        { path: "/settings", label: "Settings", icon: <SettingsIcon /> },
    ];

    const adminItems = [
        { path: "/admin/users", label: "UserManagement", icon: <GroupIcon /> },
        { path: "/admin/logs", label: "SystemLogs", icon: <AssignmentIcon /> },
    ]

    const helpItem = { path: "/help", label: "Help", icon: <HelpIcon /> };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: isCollapsed ? 75 : 225,
                flexShrink: 0,
                zIndex: 1200,
                transition: "width 0.3s ease-in-out",
                "& .MuiDrawer-paper": {
                    width: isCollapsed ? 75 : 225,
                    overflowY: "auto",
                    overflowX: "hidden",
                    transition: "width 0.3s ease-in-out",
                },
            }}
        >
            {/* Sidebar Container */}
            <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 1200, borderRight: '1px solid #bbb' }}>
                {/* Main Menu Items */}
                <List sx={{ paddingTop: 8 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.path} disablePadding sx={{ display: "block", justifyContent: 'center' }}>
                            <Tooltip 
                                title={item.label} 
                                placement="right-end"
                                arrow
                                disableHoverListener={!isCollapsed}
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
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={currentPath === item.path}
                                    sx={{
                                        minHeight: 50,
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        px: 2,
                                        "&.Mui-selected": {
                                            color: "inherit"
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "inherit", minWidth: 0, mr: isCollapsed ? "auto" : 2, pl: 1 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    {!isCollapsed && <ListItemText primary={item.label} />}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                    <Divider sx={{ margin: "5px 5px", borderBottom: '1px solid' }} />
                
                {/* Admin Section */}
                {role <= 2 && (
                    <>
                    {adminItems.map((item) => (
                        <ListItem key={item.path} disablePadding sx={{ display: "block", justifyContent: 'center' }}>
                            <Tooltip 
                                title={item.label} 
                                placement="right-end"
                                arrow
                                disableHoverListener={!isCollapsed}
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
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={currentPath === item.path}
                                    sx={{
                                        minHeight: 50,
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        px: 2,
                                        "&.Mui-selected": {
                                            color: "inherit"
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "inherit", minWidth: 0, mr: isCollapsed ? "auto" : 2, pl: 1 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    {!isCollapsed && <ListItemText primary={item.label} />}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                    </>
                )}
                </List>

                {/* Bottom Help Section */}
                <List sx={{ paddingBottom: 0.5 }}>
                    <Divider sx={{ margin: "5px 5px", borderBottom: '1px solid' }} />
                    <ListItem key={helpItem.path} disablePadding sx={{ display: "block", justifyContent: 'center' }}>
                        <Tooltip 
                            title={helpItem.label} 
                            placement="right-start" 
                            arrow
                            disableHoverListener={!isCollapsed}
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
                            <ListItemButton
                                component={Link}
                                to={helpItem.path}
                                selected={currentPath === helpItem.path}
                                sx={{
                                    minHeight: 50,
                                    justifyContent: isCollapsed ? "center" : "flex-start",
                                    px: 2,
                                    "&.Mui-selected": {
                                        color: "inherit"
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "inherit", minWidth: 0, mr: isCollapsed ? "auto" : 2, pl: 1 }}>
                                    {helpItem.icon}
                                </ListItemIcon>
                                {!isCollapsed && <ListItemText primary={helpItem.label} />}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
