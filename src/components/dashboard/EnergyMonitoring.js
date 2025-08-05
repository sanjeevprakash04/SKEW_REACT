import { Box, Card, CardContent, Typography, Divider } from '@mui/material';
import SpeedoMeter from '../Meter/SpeedoMeter';
import LiveStackedChart from '../stackedchart/LiveStackedChart';
import Bar30days from '../barchart/Bar30days';
import Bar12months from '../barchart/Bar12months';
import { useTheme } from '@emotion/react';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

function EnergyMonitoring({ title, meterData }){
    const { updateMaxTHD } = useContext(AppContext);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    useEffect(() => {
        if (meterData) {
          updateMaxTHD(meterData);
        }
    }, [meterData, updateMaxTHD]);

    const voltageMap = {
        Voltage1: 'Voltage V12',
        Voltage2: 'Voltage V23',
        Voltage3: 'Voltage V31',
    };

    const currentMap = {
        Current1: 'Current I1',
        Current2: 'Current I2',
        Current3: 'Current I3'
    }

    const frequencyMap = {
        Frequency: 'Frequency'
    }

    return (
        <Box display="flex" p={1} flexDirection="column" sx={{ height: '100vh', bgcolor: isDarkMode ? "#333" : "#f4f6f8" }} gap={1}> 
            <Box display="flex" ml={0.5} height="3vh">
                <Typography variant="h3" fontWeight="bold" color="inherit" fontSize={22}>
                    {title}
                </Typography>
            </Box>    
        
            <Divider sx={{ borderBottom: "1px solid", mb:0 }} />

            <Box display="flex" flexDirection="column" height="83vh" width="100%" m={0}>
                <Box display="flex" gap={1} sx={{ height: '30vh', width: "100%"}}>
                    <Card sx={{ height: 'calc(30vh - 5px)', width: "20%"}}>
                    <CardContent sx={{ height:'calc(30vh - 5px)' , alignItems:"center", justifyContent:'center' }}>
                        {/* <Typography variant="subtitle1">PowerKW</Typography>
                        <Divider sx={{ my: 0.2 }}/> */}
                        <Box width='100%' height='100%' overflow='hidden' sx={{ display:'flex', justifyContent:'center', alignItems:'center', p:2}}>
                            <SpeedoMeter label='PowerKW' meterData={meterData.PowerKW4} unit='kW' maxValue={20} segmentColors={["#00C853", "#00C853", "#00C853", "#FFEB3B", "#D50000"]}/>
                        </Box>
                    </CardContent>
                    </Card>

                    <Card sx={{ height: 'calc(30vh - 5px)', width: "20%"}}>
                    <CardContent sx={{ height:'calc(30vh - 5px)' , alignItems:"center", justifyContent:'center' }}>
                        {/* <Typography variant="subtitle1">PowerKVA</Typography>
                        <Divider sx={{ my: 0.2 }}/> */}
                        <Box width='100%' height='100%' overflow='hidden' sx={{ display:'flex', justifyContent:'center', alignItems:'center', p:2}}>
                            <SpeedoMeter label='PowerKVA' meterData={meterData.PowerKVA4} unit='kVA' maxValue={20} segmentColors={["#00C853", "#00C853", "#00C853", "#FFEB3B", "#D50000"]}/>
                        </Box>
                    </CardContent>
                    </Card>

                    <Card sx={{ height: 'calc(30vh - 5px)', width: "20%"}}>
                    <CardContent sx={{ height:'calc(30vh - 5px)' , alignItems:"center", justifyContent:'center' }}>
                        {/* <Typography variant="subtitle1">PowerFactor</Typography>
                        <Divider sx={{ my: 0.2 }}/> */}
                        <Box width='100%' height='100%' overflow='hidden' sx={{ display:'flex', justifyContent:'center', alignItems:'center', p:2}}>
                            <SpeedoMeter label='PowerFactor' meterData={meterData.PowerFactor4} unit='' maxValue={1} segmentColors={["#D50000", "#D50000", "#D50000", "#FFEB3B", "#00C853"]}/>
                        </Box>
                    </CardContent>
                    </Card>

                    <Card sx={{ height: 'calc(30vh - 5px)', width: "40%"}}>
                    <CardContent sx={{ height:'calc(30vh - 5px)' , alignItems:"center", justifyContent:'center' }}>
                        <LiveStackedChart meterData={meterData}/>
                    </CardContent>
                    </Card>
                </Box>

                <Box display="flex" sx={{ height: '18vh' }} gap={1} width="100%">
                    <Card sx={{ height: '100%', width: "15%" }}>
                        <CardContent>
                            <Box>
                                <Typography variant="body1" fontWeight="bold" sx={{ textAlign: 'left', position: 'sticky' }}>
                                    Voltage
                                </Typography>
                                <Divider sx={{ my: 0.5 }} />
                            </Box>
                            <Box sx={{ display:'flex', flexDirection: 'column', alignItems: 'center', height:'calc(15vh - 65px)' }}>
                                {Object.entries(voltageMap).map(([key, label]) => (
                                    <Typography key={key} variant="body1" fontSize={15}>
                                        {label} - {meterData[key] ? parseFloat(meterData[key]).toFixed(2) : '0.0'} V
                                    </Typography>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ height: '100%', width: "15%" }}>
                        <CardContent>
                            <Box>
                                <Typography variant="body1" fontWeight="bold" sx={{ textAlign: 'left', position: 'sticky' }}>
                                    Current
                                </Typography>
                                <Divider sx={{ my: 0.5 }} />
                            </Box>
                            <Box sx={{ display:'flex', flexDirection: 'column', alignItems: 'center', height:'calc(15vh - 65px)' }}>
                                {Object.entries(currentMap).map(([key, label]) => (
                                    <Typography key={key} variant="body1" fontSize={15}>
                                        {label} - {meterData[key] ? parseFloat(meterData[key]).toFixed(2) : '0.0'} A
                                    </Typography>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ height: '100%', width: "15%" }}>
                        <CardContent>
                            <Box>
                                <Typography variant="body1" fontWeight="bold" sx={{ textAlign: 'left', position: 'sticky' }}>
                                    Frequency
                                </Typography>
                                <Divider sx={{ my: 0.5 }} />
                            </Box>
                            <Box sx={{ display:'flex', flexDirection: 'column', alignItems: 'center', height:'calc(15vh - 65px)' }}>
                                {Object.entries(frequencyMap).map(([key, label]) => (
                                    <Typography key={key} variant="body1" fontSize={15}>
                                       {label} - {meterData[key] ? parseFloat(meterData[key]).toFixed(2) : '0.0'} Hz
                                    </Typography>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ height: '100%', width: "55%", display:'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'left', pl:4 }}>
                        <CardContent>
                            <Box sx={{ display:'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'left' }}>
                                <Typography variant="body1" fontSize={16}>
                                    <strong>MAX Demand</strong> - {meterData.PowerKVA4} kVA<br/><br/>
                                    <strong>Energy</strong> - {meterData.KWH} kWh
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box display="flex" sx={{ height: '30vh'}} gap={1} width="100%" pt={0.5}>
                    <Card sx={{ height: 'calc(35vh - 5px)', width:"60%" }}>
                        <CardContent sx={{ height: 'calc(35vh - 5px)', alignItems:"center", justifyContent:'center' }}>
                            <Box width='100%' height='100%'>
                                <Bar30days />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ height: 'calc(35vh - 5px)', width:"40%" }}>
                        <CardContent sx={{ height: 'calc(35vh - 5px)', alignItems:"center", justifyContent:'center' }}>
                            <Box width='100%' height='100%'>
                                <Bar12months />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default EnergyMonitoring;