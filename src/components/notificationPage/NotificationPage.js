import { useState, useEffect } from "react";
import { Box, Typography, Divider, Button} from "@mui/material";
import NotificationSettings from "../notificationSettings/NotificationSettings";
import AlertsPage from "../alerts/Alerts";

function NotificationPage() {
    const [activeComponent, setActiveComponent] = useState('alerts');

    useEffect(() => {
        setActiveComponent(activeComponent);
    }, [activeComponent]);

    const handleFetchAlerts = () => {
        setActiveComponent('alerts');
    };

    const handleFetchSettings = () => {
        setActiveComponent('settings');
    }

    return(
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    Notification
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mr:1, }}>
                    <Button variant="contained" color="primary" sx={{ width: '150px' }} onClick={handleFetchAlerts}>
                        Notifications
                    </Button>
                    <Button variant="contained" color="primary" sx={{ width: '120px' }} onClick={handleFetchSettings}>
                        Settings
                    </Button>
                </Box>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />

            <Box mt={0.5} height="calc(100vh - 130px)">
                {activeComponent === 'alerts' && <AlertsPage />}
                {activeComponent === 'settings' && <NotificationSettings />}
            </Box>
        </Box>
    );
};

export default NotificationPage;