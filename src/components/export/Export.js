import { useState, useEffect, useContext, useCallback } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import MainTable from "../table/TableComp";
import LineChartComponent from "../linechart/LineChartComp";
import { AuthContext } from "../../context/AuthContext";
// import { AppContext } from "../../context/AppContext";
import { fetchData, exportData } from "../../utils/dataUtils";

function Export(){
    // const {isConnected} = useContext(AppContext);
    const {user} = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [activeComponent, setActiveComponent] = useState('table'); // Track which component to render
    const [hours, setHours] = useState("1 Hr");  // Default hours
    const [fromTime, setFromTime] = useState(""); 
    const [toTime, setToTime] = useState("");
    const [reportParams, setReportParams] = useState({
        hoursReport: "",
        fromTimeReport: "",
        toTimeReport: ""
    });

    useEffect(() => {
        setActiveComponent(activeComponent); // Set default active component to 'table'
        fetchData(hours, fromTime, toTime).then(setData); // Automatically fetch data when Export component is mounted
    }, [hours, fromTime, toTime, activeComponent]);

    const handleParamsChange = useCallback((params) => {
        setReportParams({
            hoursReport: params.hours,
            fromTimeReport: params.fromTime,
            toTimeReport: params.toTime
        });
    }, []);
    
    const handleExportData = () => {
        exportData(hours, fromTime, toTime);
    }

    const handleFetchTable = () => {
        setActiveComponent('table');
        fetchData(hours, fromTime, toTime).then(setData); // Call fetchData from Export.js with user inputs
    };

    const handleFetchGraph = () => {
        setActiveComponent('graph');
    }

    // const handleReportDownload = () => {
    //     const { hoursReport, fromTimeReport, toTimeReport } = reportParams;
    //     downloadReport(hoursReport, fromTimeReport, toTimeReport);
    // }

    return (
        <Box display="flex" flexDirection="column" p={1} sx={{ height: '100vh' }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={0.5} ml={0.5}>
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22} pt={1.5}>
                    Historical Data
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="primary" sx={{ width: '120px' }} onClick={handleFetchTable}>
                        View
                    </Button>
                    <Button variant="contained" color="primary" sx={{ width: '120px' }} onClick={handleFetchGraph}>
                        Graph
                    </Button>
                    <Button variant="contained" disabled={user.role > 4} color="primary" sx={{ width: '120px' }} onClick={handleExportData}>
                        Export
                    </Button>
                    {/* <Button variant="contained" disabled={user.role > 4} color="primary" sx={{ width: '120px' }} onClick={handleReportDownload}>
                        Download
                    </Button> */}
                </Box>
            </Box>
            
            <Divider sx={{ borderBottom: "1px solid" }} />

            <Box mt={0.5} height="calc(100vh - 130px)">
                {activeComponent === 'table' && <MainTable fetchData={fetchData} data={data} 
                    hours={hours}
                    setHours={setHours}
                    fromTime={fromTime}
                    setFromTime={setFromTime}
                    toTime={toTime}
                    setToTime={setToTime}
                    setActiveComponent={setActiveComponent}
                />}
                {activeComponent === 'graph' && <LineChartComponent setActiveComponent={setActiveComponent} onParamsChange={handleParamsChange}/>}
            </Box>
        </Box>
    );
};

export default Export;