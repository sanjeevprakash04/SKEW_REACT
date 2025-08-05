import { useContext } from "react";
import { Box, Typography, Divider, Paper, List, ListItem, ListItemText, Button, TextField } from "@mui/material";
import Logo from "./logo.png";
import { AppContext } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";

function About() {
    const { user } = useContext(AuthContext);
    const { initialValues, isConnected } = useContext(AppContext);

    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    About
                </Typography>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />

            {/* Widgets Section */}
            <Box sx={{ display: "flex", flexDirection: "column", mt: 0.5 , height: "calc(100vh - 130px)"}}>
            
            {/* Upper Widget */}
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    overflowY: "auto",
                    border: "1px solid #bbb",
                    boxShadow: 'none',
                    textAlign: "center",
                    height: "calc(70vh - 62px)",
                }}
            >
                {/* Logo */}
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#fff", borderRadius: 1, p: 1 }}>
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
                <Typography sx={{ fontSize: 16 }}>
                    Email: <strong>info@proliteautomation.com</strong>
                </Typography>
                </Box>
            </Paper>

            {/* Lower Widget */}
            <Paper
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                p: 2,
                mt: 0.5,
                border: "1px solid #bbb",
                boxShadow: 'none',
                height: "calc(30vh - 75px)",
                }}
            >

                {/* Input Field & Button */}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                <TextField
                    placeholder="Enter Licence Key"
                    variant="outlined"
                    value = {initialValues.licence}
                    sx={{ 
                        maxwidth: 500,
                        minWidth: 350,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            borderColor: "#aaa",
                        },
                    }}
                    slotProps={{
                        input: {sx: { height: 45, fontSize: 15 }},
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={user.role > 2  || isConnected}
                    sx={{
                        height: 45,
                        width: 120,
                    }}
                >
                    Activate
                </Button>
                </Box>

                <Typography sx={{ pr: 1 }}>Software Version: <strong>{initialValues.revision}</strong></Typography>
            </Paper>
            </Box>
        </Box>
    );
};

export default About;
