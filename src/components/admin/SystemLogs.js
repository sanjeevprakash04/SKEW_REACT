import { useState, useContext } from "react";
import { Box, Button, Typography, Divider, } from "@mui/material";
import { AppContext } from "../../context/AppContext";

function SystemLogs() {
    const {isConnected} = useContext(AppContext);
    const [message] = useState("No logs to display");

    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    SystemLogs
                </Typography>
                <Button variant="contained" color="primary" sx={{ width: '120px' }} disabled={isConnected}>
                    Clear
                </Button>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />

            <Box 
                mt={0.5} 
                p={1}
                pl={1.5}
                border={1} 
                borderColor="#bbb" 
                borderRadius={1} 
                height="calc(100vh - 130px)"
                overflow="auto"
            >
                <Typography fontSize={15}>{message}</Typography>
            </Box>
        </Box>
    );
};

export default SystemLogs;