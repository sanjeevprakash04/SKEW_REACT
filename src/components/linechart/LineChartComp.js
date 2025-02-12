import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, Typography, Button, Drawer, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Define a color palette for different Names
const colorPalette = [
    '#8884d8', '#82ca9d', '#ff7300', '#ff4560', '#00e396', '#008ffb', '#feb019', '#775dd0', '#DE3163', '#40E0D0'
];

const LineChartComponent = ({data}) => {
  const [selection, setSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [zoomedData, setZoomedData] = useState([]);
  const [xDomain, setXDomain] = useState([0, 0]);
  const [yDomain, setYDomain] = useState([0, 0]);
  const [rerender, setRerender] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedNames, setSelectedNames] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');

  // Temporary states for filters
  const [tempSelectedNames, setTempSelectedNames] = useState({});
  const [tempSelectedCategory, setTempSelectedCategory] = useState('');

  useEffect(() => {
    if (data && data.length > 0) {
      // Convert Timestamp to Unix timestamp and ensure Value is a number
      const formattedData = data.map((d) => ({
        TimeStamp: new Date(d.TimeStamp).getTime(), // Convert Timestamp to timestamp
        Value: Number(d.Value), // Ensure Value is a number
        Name: d.Name, // Keep track of the Name for grouping
        Category: d.Category // Store Category
      }));
      
      setOriginalData(formattedData);
      setZoomedData(formattedData);

      // Initialize selectedNames state
      const uniqueNames = [...new Set(formattedData.map((d) => d.Name))];
      const initialNameSelection = uniqueNames.reduce((acc, name) => ({ ...acc, [name]: true }), {});
      setSelectedNames(initialNameSelection);
      setTempSelectedNames(initialNameSelection);

      // Set X-axis domain
      const minX = Math.min(...formattedData.map((d) => d.TimeStamp));
      const maxX = Math.max(...formattedData.map((d) => d.TimeStamp));
      setXDomain([minX, maxX]);

      // Update Y-axis dynamically based on min/max Value
      let minY = Math.min(...formattedData.map((d) => d.Value));
      let maxY = Math.max(...formattedData.map((d) => d.Value));
      
      setYDomain([minY-50, maxY+50]);
    }
  }, [data]);

  const applyFilters = () => {
    setSelectedCategory(tempSelectedCategory);
    setSelectedNames(tempSelectedNames);
    setOpenSidebar(false);
  };

  // Update filtered data when checkboxes or category selection change
  useEffect(() => {
    const updatedData = originalData.filter((d) =>
      (selectedCategory === '' || d.Category === selectedCategory) &&
      selectedNames[d.Name]
    );
    setZoomedData(updatedData);
  }, [selectedCategory, selectedNames, originalData]);

  const getXTimeStamp = (xPos, chartWidth) => {
    const ratio = xPos / chartWidth;
    return xDomain[0] + ratio * (xDomain[1] - xDomain[0]);
  };

  const getYValue = (yPos, chartHeight) => {
    const ratio = 1 - yPos / chartHeight; // Inverting since y=0 is at the top
    return yDomain[0] + ratio * (yDomain[1] - yDomain[0]);
  };

  // Group data by Name
  const groupedData = {};
  zoomedData.forEach((entry) => {
    if (!groupedData[entry.Name]) {
      groupedData[entry.Name] = [];
    }
    groupedData[entry.Name].push(entry);
  });

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleCheckboxChange = (name) => {
    setTempSelectedNames((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleMouseDown = (e) => {
    if (e.detail === 2) {
      setZoomedData(originalData);

      const minX = Math.min(...originalData.map((d)=>d.TimeStamp));
      const maxX = Math.max(...originalData.map((d)=>d.TimeStamp));

      let minY = Math.min(...originalData.map((d) => d.Value));
      let maxY = Math.max(...originalData.map((d) => d.Value));

      setXDomain([minX,maxX]);
      setYDomain([minY-50, maxY+50]);
      setRerender((prev) => !prev);
      return;
    }

    const chartContainer = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - chartContainer.left;
    const yPos = e.clientY - chartContainer.top;
    setIsSelecting(true);
    setSelection({ startX: xPos, startY: yPos, endX: xPos, endY: yPos });
  };

  const handleMouseMove = (e) => {
    if (!isSelecting || !selection) return;
    const chartContainer = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - chartContainer.left;
    const yPos = e.clientY - chartContainer.top;
    setSelection((prev) => ({ ...prev, endX: xPos, endY: yPos }));
  };

  const handleMouseUp = (e) => {
    if (!selection || Math.abs(selection.startX - selection.endX) < 5) {
      setIsSelecting(false);
      setSelection(null);
      return;
    }
    
    const chartContainer = e.currentTarget.getBoundingClientRect();
    const chartWidth = chartContainer.width;
    const chartHeight = chartContainer.height;
    
    let startTimeStamp = getXTimeStamp(selection.startX, chartWidth);
    let endTimeStamp = getXTimeStamp(selection.endX, chartWidth);
    
    if (startTimeStamp > endTimeStamp) {
      [startTimeStamp, endTimeStamp] = [endTimeStamp, startTimeStamp];
    }

    let startValue = getYValue(selection.startY, chartHeight);
    let endValue = getYValue(selection.endY, chartHeight);
    if (startValue > endValue) [startValue, endValue] = [endValue, startValue];

    const filterData = originalData.filter(
      (d) => d.TimeStamp >= startTimeStamp && d.TimeStamp <= endTimeStamp && d.Value >= startValue && d.Value <= endValue
    );

    if (filterData.length > 0) {
      setZoomedData(filterData);
      setXDomain([Math.min(...filterData.map((d) => d.TimeStamp)), Math.max(...filterData.map((d) => d.TimeStamp))]);
      setYDomain([Math.min(...filterData.map((d) => d.Value)) - 50, Math.max(...filterData.map((d) => d.Value)) + 50]);
    }

    setIsSelecting(false);
    setSelection(null);
  };

  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardContent sx={{height: 'calc(100vh - 179px)', width: '100%'}}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '5px' }}>
          <Button 
            variant="contained" 
            onClick={toggleSidebar}
            style={{ padding: '10px', width: '85px', height: '4vh', margin: '4px'}} 
            sx={{ backgroundColor: '#103782', ":hover": { backgroundColor: '#166afc'} }}
          >
            Filter
          </Button>
        </div>
        <div
          className="chart-container"
          style={{ height: 'calc(90vh - 155px)',width: '100%', overflow: 'hidden'}}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsSelecting(false)}
        >
          <ResponsiveContainer 
            width="100%" 
            height="100%"
            key={rerender}
          >
            <LineChart data={zoomedData} margin={{ top: 20, right: 30, left: 50, bottom: 50 }} overflow="auto">
              {/* Soft grid lines for readability */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X-Axis Styling */}
              <XAxis
                dataKey="TimeStamp"
                type="number"
                domain={xDomain}
                scale="time"
                tickFormatter={(tick) => new Date(tick).toISOString().slice(0, 19).replace("T", " ")}
                label={{ value: "Timestamp", position: "insideBottom", offset: -20, fontSize: 18 }}
                tick={{ fontSize: 13 }}
              />

              {/* Y-Axis Styling */}
              <YAxis
                dataKey="Value"
                domain={yDomain}
                label={{ value: "Value", angle: -90, position: "insideLeft", offset: -15, fontSize: 18 }}
                tick={{ fontSize: 13 }}
              />

              {/* Tooltip with better formatting */}
              <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />

              {/* Improved Legend Positioning */}
              <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 15, marginBottom: 10 }} />

              {/* Reference lines for clarity */}
              <ReferenceLine x={0} stroke="black" strokeWidth={1.5} strokeDasharray="5 5" />
              <ReferenceLine y={0} stroke="black" strokeWidth={1.5} strokeDasharray="5 5" />

              {/* Dynamic Line Chart */}
              {Object.keys(groupedData).map((Name, index) => (
                <Line
                  key={Name}
                  data={groupedData[Name]}
                  type="linear"
                  dataKey="Value"
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={2}
                  name={Name}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {selection && isSelecting && (
            <div
              style={{
                position: 'absolute',
                left: Math.min(selection.startX, selection.endX),
                top: Math.min(selection.startY, selection.endY),
                width: Math.abs(selection.endX - selection.startX),
                height: Math.abs(selection.endY - selection.startY),
                backgroundColor: 'rgba(0, 0, 255, 0.3)',
                border: '2px dashed blue',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </CardContent>

      {/* Sidebar for Filters */}
      <Drawer
        anchor="right"
        open={openSidebar}
        onClose={toggleSidebar}
        style={{ overflow: 'auto' }}
      >
        <div style={{ width: 400, padding: 35 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleSidebar}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Category Dropdown */}
          <FormControl fullWidth style={{ marginBottom: 20, marginTop: 20 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={tempSelectedCategory}
              onChange={(e) => setTempSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(originalData.map((d) => d.Category))].map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Name Checkboxes */}
          <Typography variant="subtitle1">Select Lines:</Typography>
          <FormGroup style={{ marginLeft: '15px' }}>
            {Object.keys(tempSelectedNames).map((name) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox
                    checked={tempSelectedNames[name]}
                    onChange={() => handleCheckboxChange(name)}
                  />
                }
                label={name}
              />
            ))}
          </FormGroup>

          {/* Apply Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 16 }}
            onClick={applyFilters}
          >
            Apply
          </Button>
        </div>
      </Drawer>
    </Card>
  );
};

export default LineChartComponent;