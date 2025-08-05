import { Box, Typography, Divider, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useTheme } from '@mui/material/styles';
import GaugeMeterImage from "./Gaugemeter.png";
import DataAnalysisImage from "./DataAnalysis.jpg";

function Dashboard({ setActiveComponent }) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    const handleDataPage = ()=> {
        navigate('/dashboard/datamonitoring');
    };

    const handleEnergyPage1 = () => {
        setActiveComponent('monitor 1');
        navigate('/dashboard/energymonitoring');
    };

    const handleEnergyPage2 = () => {
        setActiveComponent('monitor 2');
        navigate('/dashboard/energymonitoring');
    };

    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh', bgcolor: isDarkMode ? "#333" : "#f4f6f8" }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22}>
                    Dashboard
                </Typography>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />
            
            {/* Widgets Section */}
            <Box display="flex" py={1} px={3} height="calc(100vh - 120px)" gap={1} overflow="auto">
                <Card sx={{ width:"20%", bgcolor: isDarkMode ? "#666" : "#fff", height: "31vh" }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1 }}>
                        <img src={DataAnalysisImage} alt="GaugeMeterImage" style={{ height: 50 }} />
                        <Typography variant="subject1">Data Monitoring</Typography>
                        <Typography sx={{ fontSize: 13, textAlign: "center" }}>
                            The page for monitoring the data. It shows the data related to the energy consumption.
                        </Typography>
                        <Button variant="contained" color="secondary" sx={{ textTransform: "none" }} onClick={handleDataPage}>Go</Button>
                    </CardContent>
                </Card>
                <Card sx={{ width:"20%", bgcolor: isDarkMode ? "#666" : "#fff", height: "31vh" }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1 }}>
                        <img src={GaugeMeterImage} alt="GaugeMeterImage" style={{ height: 50 }} />
                        <Typography variant="subject1">Energy Monitoring 1</Typography>
                        <Typography sx={{ fontSize: 13, textAlign: "center" }}>
                            The page for monitoring the energy. It shows the data related to the energy consumption.
                        </Typography>
                        <Button variant="contained" color="secondary" sx={{ textTransform: "none" }} onClick={handleEnergyPage1}>Go</Button>
                    </CardContent>
                </Card>
                <Card sx={{ width:"20%", bgcolor: isDarkMode ? "#666" : "#fff", height: "31vh" }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1 }}>
                        <img src={GaugeMeterImage} alt="GaugeMeterImage" style={{ height: 50 }} />
                        <Typography variant="subject1">Energy Monitoring 2</Typography>
                        <Typography sx={{ fontSize: 13, textAlign: "center" }}>
                            The page for monitoring the energy. It shows the data related to the energy consumption.
                        </Typography>
                        <Button variant="contained" color="secondary" sx={{ textTransform: "none" }} onClick={handleEnergyPage2}>Go</Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Dashboard;
