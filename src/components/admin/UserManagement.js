import { useState, useEffect, useContext, useCallback } from "react";
import { Box, Button, Typography, Divider, Modal, TextField, Select, MenuItem, Backdrop, IconButton } from "@mui/material";
import axios from "axios";
import UserTable from "../table/userTable";
import { AuthContext } from "../../context/AuthContext";
import { Close } from "@mui/icons-material";
import Logo from './skew-logo-horizontal.png';
// import { AppContext } from "../../context/AppContext";

function UserManagement({ role }) {
    // const {isConnected} = useContext(AppContext);
    const { accessToken/*, refreshAccessToken */, logoutUser} = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState(5);

    const fetchUserData = useCallback(async () => {
        if (!accessToken) return;
    
        try {
            const response = await axios.get("http://127.0.0.1:8000/get-user-data", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setData(response.data.data);  // ✅ Update state immediately
        } catch (error) {
            console.error("Error fetching user data:", error);

            if (error.response?.status === 401) {
                logoutUser();
            }
        }
    }, [accessToken/*, refreshAccessToken*/, logoutUser]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleCreateUser = async () => {
        const formData = new FormData();
        formData.append("email", newEmail);
        formData.append("role_id", newRole);
        try {
            await axios.post("http://127.0.0.1:8000/create-user", formData, {
                headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/x-www-form-urlencoded" }
            });
            setOpenModal(false);
            fetchUserData();
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh', zIndex: 1200 }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    UserDetails
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="primary" sx={{ textTransform: 'none', width: '120px' }} onClick={() => setOpenModal(true)}>
                        Add User
                    </Button>
                    <Button variant="contained" color="primary" sx={{ textTransform: 'none', width: '120px' }}>
                        Export
                    </Button>
                </Box>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />

            <Box mt={0.5} height="calc(100vh - 130px)">
                <UserTable data={data} role={role} accessToken={accessToken} onLoad={fetchUserData}/>
            </Box>

            <Modal 
                open={openModal} 
                onClose={() => setOpenModal(false)} 
                sx={{ zIndex: 1202, }}
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
                <Box
                    sx={{
                    width: "90%",
                    maxWidth: 450,
                    bgcolor: "background.paper",
                    alignItems: 'center',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    }}
                >
                    <IconButton
                        onClick={() => setOpenModal(false)}
                        sx={{ position: "absolute", top: 10, right: 10 }}
                    >
                        <Close />
                    </IconButton>

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 1, p: 1 }}>
                        <img src={Logo} alt="Logo" style={{ height: 40, objectFit: "contain" }} />
                    </Box>
            
                    <Typography variant="h6" mb={1} mt={1}>
                        Create New User
                    </Typography>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        value={newEmail}
                        autoComplete="off"
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Select
                        fullWidth
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        sx={{
                        "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "left",
                            fontSize: 14,
                          },
                        }}
                    >
                        {role === 1
                            ? [
                                <MenuItem key="admin" value={2} sx={{ fontSize: 14 }}>Admin</MenuItem>,
                                <MenuItem key="manager" value={3} sx={{ fontSize: 14 }}>Manager</MenuItem>,
                                <MenuItem key="engineer" value={4} sx={{ fontSize: 14 }}>Engineer</MenuItem>,
                                <MenuItem key="operator" value={5} sx={{ fontSize: 14 }}>Operator</MenuItem>
                            ]
                        : role === 2
                            ? [
                                <MenuItem key="manager" value={3} sx={{ fontSize: 14 }}>Manager</MenuItem>,
                                <MenuItem key="engineer" value={4} sx={{ fontSize: 14 }}>Engineer</MenuItem>,
                                <MenuItem key="operator" value={5} sx={{ fontSize: 14 }}>Operator</MenuItem>
                            ]
                        : null
                        }
                    </Select>
                    <Button variant="contained" color="primary" fullWidth sx={{ textTransform: 'none', mt: 2 }} onClick={handleCreateUser}>
                        Create
                    </Button>
                </Box>
            </Modal>
            
        </Box>
    );
};

export default UserManagement;