import { Box, Typography, Divider, } from "@mui/material";

function Help() {
    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    Help
                </Typography>
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
            </Box>
        </Box>
    );
};

export default Help;