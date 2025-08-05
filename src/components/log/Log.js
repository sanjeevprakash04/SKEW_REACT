import { useContext } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { AppContext } from "../../context/AppContext";

function Log({logs, logEndRef, clearLogs}){
    const {isConnected} = useContext(AppContext);
    const { user } = useContext(AuthContext);
    const handleClearLogs = ()=> {
        clearLogs();
    };

    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    Log
                </Typography>
                <Button variant="contained" disabled={(user && user.role > 3) || isConnected} color="primary" sx={{ width: '120px' }} onClick={handleClearLogs}>
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
                {logs.map((log, index) => (
                    <Typography key={index} fontSize={15}>
                        {log}
                    </Typography>
                ))}
                <Box ref={logEndRef}/>
            </Box>
        </Box>
    );
};

export default Log;