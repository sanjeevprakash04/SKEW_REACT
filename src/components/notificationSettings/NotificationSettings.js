import { useState, useEffect } from 'react';
import { Box, Button, Modal, Backdrop, TextField, Typography, IconButton, } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import AlertsTable from '../table/alertsTable';
import axios from 'axios';

function NotificationSettings() {
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newCondition, setNewCondition] = useState("");

    useEffect(() => {
        fetchAlertsData();   // fetch alerts on first render
    }, [])

    const fetchAlertsData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/get-alerts-data");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching alerts data:", error);
        }
    };

    const handleCreateAlert = async (newName, newCondition) => {
        const formData = new FormData();
        formData.append("name", newName);
        formData.append("condition", newCondition);

        try {
            await axios.post("http://127.0.0.1:8000/create-alert", formData);
            setOpenModal(false);
            setNewName("");
            setNewCondition("");
            fetchAlertsData();
        } catch (error) {
            console.error("Error creating alert:", error);
        }
    };

    return(
        <Box mt={0.5} height="calc(100vh - 126px)">
            <Box display="flex" justifyContent="flex-end" mr={1}>
                <Button variant="contained" color="secondary" onClick={() => setOpenModal(true)}>
                    Add Alert
                </Button>
            </Box>
            <AlertsTable data={data} onLoad={fetchAlertsData}/>

            {/* Modal for Create Alert */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{ zIndex: 1202 }}
                disableAutoFocus
                disableEnforceFocus
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: { sx: { backdropFilter: "blur(10px)" } },
                }}
            >
                <Box
                    sx={{
                        width: "90%",
                        maxWidth: 450,
                        bgcolor: "background.paper",
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
                    {/* Close button */}
                    <IconButton
                        onClick={() => setOpenModal(false)}
                        sx={{ position: "absolute", top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" mb={2}>
                        Create New Alert
                    </Typography>

                    {/* Alert Name */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Alert Name"
                        value={newName}
                        autoComplete="off"
                        onChange={(e) => setNewName(e.target.value)}
                    />

                    {/* Alert Condition */}
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Condition"
                        value={newCondition}
                        autoComplete="off"
                        onChange={(e) => setNewCondition(e.target.value)}
                    />

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ textTransform: "none", mt: 2 }}
                        onClick={() => handleCreateAlert(newName, newCondition)}
                    >
                        Create
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default NotificationSettings;