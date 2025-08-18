import /*React,*/ { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Box, Card, CardContent, Typography, Button, Drawer, FormControl, InputLabel } from '@mui/material';
import { Select, MenuItem, FormGroup, FormControlLabel, Checkbox, IconButton, TextField, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchGraphData, fetchPresets, savePreset, deletePreset } from "../../utils/dataUtils";
import { useTheme } from '@mui/material/styles';

// Define a color palette for different Names
const colorPalette = [
  '#FF1493', '#0099FF', '#32CD32', '#FF4500', '#FFBF00', '#DC143C', '#9932CC', '#40E0D0', '#4169E1', '#FFA500', '#4B0082'
];

function LineChartComponent ({setActiveComponent, onParamsChange}) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const isDarkMode = theme.palette.mode === 'dark';
  const [originalData, setOriginalData] = useState([]); // Stores unfiltered data
  const [filteredData, setFilteredData] = useState([]);
  const [selectedNames, setSelectedNames] = useState({});
  // eslint-disable-next-line
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hours, setHours] = useState("1 Hr");  // Default hours
  const [fromTime, setFromTime] = useState(""); 
  const [toTime, setToTime] = useState("");
  // Local state for temporary selections before applying filters
  const [tempSelectedNames, setTempSelectedNames] = useState({});
  const [tempSelectedCategory, setTempSelectedCategory] = useState('');
  const [selectedHours, setSelectedHours] = useState(hours);
  const [selectedFromTime, setSelectedFromTime] = useState(fromTime);
  const [selectedToTime, setSelectedToTime] = useState(toTime);
  const [options, setOptions] = useState({});

  // Preset States
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [newPresetName, setNewPresetName] = useState("");

  // Fetch presets from backend
  useEffect(() => {
    fetchPresets().then(setPresets);
  }, []);

  // Load session filter state on mount
  useEffect(() => {
    const savedCategory = sessionStorage.getItem("selectedCategory");
    const savedNames = sessionStorage.getItem("selectedNames");

    if (savedCategory) {
      setSelectedCategory(savedCategory);
      setTempSelectedCategory(savedCategory);
    }
    if (savedNames) {
      const parsedNames = JSON.parse(savedNames);
      setSelectedNames(parsedNames);
      setTempSelectedNames(parsedNames);
    }
  }, []);

  useEffect(() => {
    setActiveComponent('graph'); // Set default active component to 'table'
    fetchGraphData(hours, fromTime, toTime).then(setData); // Automatically fetch data when Export component is mounted
    onParamsChange({hours, fromTime, toTime});
  }, [hours, fromTime, toTime, setActiveComponent, onParamsChange]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Convert Timestamp to Unix timestamp
    const formattedData = data.map((d) => ({
      TimeStamp: Math.floor(new Date(d.TimeStamp).getTime() / 1000),
      Value: Number(d.Value),
      Name: d.Name,
      Category: d.Category,
    }));

    setOriginalData(formattedData); // Store full dataset separately

    // Initialize checkboxes and default selections
    const uniqueNames = [...new Set(formattedData.map((d) => d.Name))];
    const initialNameSelection = uniqueNames.reduce((acc, name) => ({ ...acc, [name]: true }), {});

    // If no saved session, initialize defaults
    if (Object.keys(tempSelectedNames).length === 0) {
      setSelectedNames(initialNameSelection);
      setTempSelectedNames(initialNameSelection);
    }
    if (!tempSelectedCategory) {
      setTempSelectedCategory("");
    }

    setFilteredData(formattedData);
  }, [data, tempSelectedCategory, tempSelectedNames]);

  // Function to apply filters when "Apply" button is clicked
  const applyFilters = (names = tempSelectedNames, category = tempSelectedCategory) => {
    const newSelectedNames = { ...names };
    setSelectedNames(newSelectedNames);
    setSelectedCategory(category);

    sessionStorage.setItem("selectedCategory", category);
    sessionStorage.setItem("selectedNames", JSON.stringify(newSelectedNames));

    const updatedData = originalData.filter(
      (d) => (category === '' || d.Category === category) && newSelectedNames[d.Name]
    );

    setFilteredData(updatedData);
    setOpenSidebar(false);
  };

  const handleSetHours = (e) => {
    setSelectedHours(e.target.value);
  }

  const handleSetFromTime = (e) => {
    setSelectedFromTime(e.target.value);
  }

  const handleSetToTime = (e) => {
    setSelectedToTime(e.target.value);
  }

  const handleFetchData = () => {
    if (selectedHours === 'Custom') {
      if (!selectedFromTime || !selectedToTime) {
        alert("Please fill in both 'From' and 'To' datetime fields for Custom interval.");
        return;
      }
    }
    setHours(selectedHours);
    setFromTime(selectedFromTime);
    setToTime(selectedToTime);
    fetchGraphData(selectedHours, selectedFromTime, selectedToTime).then(setData); // Call fetchData from Export.js with user inputs
    setActiveComponent('graph');
    setOpenSidebar(false);
  };

  // Apply preset to current selection
  const handleApplyPreset = () => {
    const preset = presets.find(p => p.id === Number(selectedPresetId));
    if (preset) {
      const clonedNames = JSON.parse(JSON.stringify(preset.names));
      const category = preset.category || "";

      // Update UI states
      setTempSelectedNames(clonedNames);
      setTempSelectedCategory(category);

      // Apply filters IMMEDIATELY with preset values (no async delay issue)
      applyFilters(clonedNames, category);

      // Close drawer
      setOpenSidebar(false);
    }
  };

  // Save current selection as a preset
  const handleSavePreset = async () => {
    if (!newPresetName.trim()) {
      alert("Please enter a preset name");
      return;
    }
    try {
      const data = await savePreset({
        name: newPresetName,
        category: tempSelectedCategory,
        names: JSON.parse(JSON.stringify(tempSelectedNames)) // deep clone
      });
      setPresets(prev => [...prev, data]);
      setNewPresetName("");
      alert("Preset saved!");
    } catch (error) {
      console.error("Error saving preset:", error);
      alert("Failed to save preset");
    }
  };

  // Delete preset
  const handleDeletePreset = async (id) => {
    try {
      await deletePreset(id);
      setPresets(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting preset:", error);
      alert("Failed to delete preset");
    }
  };

  // Update the chart when `filteredData` changes
  useEffect(() => {
    // If no series are selected → show empty chart
    if (Object.values(selectedNames).every(v => v === false)) {
      setOptions({
        backgroundColor: isDarkMode ? "#1e1e1e" : "#e5ecf6",
        xAxis: { type: "time" },
        yAxis: { type: "value" },
        series: [],
      });
      return;
    }

    if (!filteredData.length) return;

    // Get min and max Y values
    const yValues = filteredData.map((d) => d.Value);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Add extra 20 points above and below
    const adjustedMinY = parseFloat((minY - 50).toFixed(2));
    const adjustedMaxY = parseFloat((maxY + 50).toFixed(2));

    const newOptions = {
        backgroundColor: isDarkMode ? "#1e1e1e" : "#e5ecf6",
        grid: {
          left: '5%',
          right: '7%',
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: { type: "cross", label: { show: false } },

          position: function (point, params, dom, rect, size) {
            const viewWidth = size.viewSize[0];
            const viewHeight = size.viewSize[1];
            const boxWidth = size.contentSize[0];
            const boxHeight = size.contentSize[1];

            let x = point[0] + 15;
            const offset = 10;
            let y;

            if (point[1] < boxHeight / 2) {
              y = point[1] + offset; // near top → show below
            } else if (point[1] > viewHeight - boxHeight / 2) {
              y = point[1] - boxHeight - offset; // near bottom → show above
            } else {
              y = point[1] - boxHeight / 2; // center
            }

            if (x + boxWidth > viewWidth) x = point[0] - boxWidth - 15;
            if (x < 0) x = 0;

            if (y < 0) y = 0;
            if (y + boxHeight > viewHeight) y = viewHeight - boxHeight;

            return [x, y];
          },

          extraCssText: `
            background: #fff;
            border: 1px solid #ccc;
            padding: 8px;
            max-width: none;
          `,

          formatter: (params) => {
            const date = new Date(params[0].value[0] * 1000);
            const seenValues = new Set();

            let content = `<div style="font-weight:bold;padding: 0.5rem;">
              ${date.toLocaleString("en-GB", {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
              }).replace(",", "")}
            </div>`;

            let dataItems = params.map(entry => {
              const value = entry.value[1];
              if (seenValues.has(value)) return "";
              seenValues.add(value);
              return `<div style="color:${entry.color}; min-width: 120px;">
                ${entry.seriesName}: ${value ?? 'null'}
              </div>`;
            }).filter(Boolean);

            if (dataItems.length > 10) {
              const mid = Math.ceil(dataItems.length / 2);
              content += `
                <div style="display:flex;gap:20px;padding: 0.5rem;">
                  <div>${dataItems.slice(0, mid).join("")}</div>
                  <div>${dataItems.slice(mid).join("")}</div>
                </div>
              `;
            } else {
              content += dataItems.join("");
            }

            return content;
          }
        },
        legend: {
          show: false,
          // bottom: 0,
          // left: "center",
          // orient: "horizontal",
          // selectedMode: false,
          // textStyle: {
          //     fontSize: 12,
          //     fontWeight: "bold", // Dynamically set legend text color based on series color
          //     color: isDarkMode ? "#eee" : "#333",
          // },
        },
        xAxis: {
            type: "time",
            name: "Timestamp",
            nameTextStyle: {
              fontSize: 13, // Font size for axis title
              fontWeight: "bold",
              color: isDarkMode ? '#aaa' : '#333',
            },
            axisLine: {
              onZero: false, // Prevents aligning with Y=0
              lineStyle: {
                color: "#999" // Set color for Y-axis line
              }
            },
            axisLabel: {
              color: isDarkMode ? "#aaa" : "#666",
              formatter: (tick) => {
                if (!filteredData.length) return ""; // Prevent errors if no data
            
                const startTime = filteredData[0]?.TimeStamp || tick;
                const endTime = filteredData[filteredData.length - 1]?.TimeStamp || tick;
                const timeSpan = endTime - startTime; // Difference in **seconds** now
            
                const date = new Date(tick * 1000); // Convert back to milliseconds for formatting
            
                if (timeSpan > 24 * 60 * 60) {
                  // More than 7 days → YYYY-MM-DD
                  return date.toISOString().split("T")[0];
                } else if (timeSpan > 60 * 60) {
                  // More than 1 day → YYYY-MM-DD HH:MM
                  return date.toLocaleString("en-CA", {  
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // Use 24-hour format
                  }).replace(",", "");
                } else {
                  // Less than 1 day → HH:MM:SS
                  return date.toTimeString().split(" ")[0]; // HH:MM:SS format
                }
              }
          },
        },
        yAxis: { 
          type: "value", 
          name: "Value",
          nameTextStyle: {
            fontSize: 13, // Font size for axis title
            fontWeight: "bold",
            color: isDarkMode ? '#aaa' : '#333',
          },
          min: adjustedMinY, // Ensures extra space below
          max: adjustedMaxY, // Ensures extra space above
          axisLabel: {
            color: isDarkMode ? "#aaa" : "#666", // Set color for Y-axis labels
          },
          axisLine: {
            show: true, // Show the line
            lineStyle: {
              color: "#999" // Set color for Y-axis line
            }
          },
          splitLine: {
            show: true,  // Ensure grid lines are visible
            lineStyle: {
              color: "#ccc", // Change this to any color (e.g., red)
              width: 1,  // Adjust line thickness
              type: "solid", // Options: 'solid', 'dashed', 'dotted'
            },
          },
        },
        dataZoom: [
            { type: "inside", xAxisIndex: 0, start: 0, end: 100 },
            // { type: "slider", show: true, xAxisIndex: 0, start: 0, end: 100, },
            // { type: "slider", show: true, yAxisIndex: 0, start: 0, end: 100, },
            { type: "inside", yAxisIndex: 0, start: 0, end: 100 },
        ],
        series: Object.keys(selectedNames)
          .filter((name) => selectedNames[name]) // Only show selected names
          .map((name, index) => {
              const seriesColor = colorPalette[index % colorPalette.length];
              const seriesData = filteredData
                  .filter((d) => d.Name === name)
                  .map((d) => [d.TimeStamp, d.Value]);

              return {
                  name,
                  type: "line",
                  data: seriesData.length ? seriesData : [],
                  smooth: true,
                  showSymbol: true,  // Enables points on the line
                  symbol: "circle",  // Shape of the points (options: 'circle', 'rect', 'triangle', etc.)
                  symbolSize: 5,
                  lineStyle: { width: 2, color: seriesColor },
                  itemStyle: { color: seriesColor, opacity: 1 }, // Ensure tooltip gets correct color
                  silent: true,
                  emphasis: {
                    focus: "none" // Removes the hover effect (no highlighting)
                  }
              };
          }
        ),
    };

    setOptions({ ...newOptions });  // Ensure options update
  }, [filteredData, selectedNames, selectedCategory, isDarkMode]);  // Graph updates when these change

   // Filter names based on category for Select All
  const visibleNames = Object.keys(tempSelectedNames).filter(name =>
    tempSelectedCategory === '' ||
    originalData.find(d => d.Name === name)?.Category === tempSelectedCategory
  );

  return (
    <Card sx={{ boxShadow: "none" }}>
      <CardContent sx={{ height: "calc(100vh - 126px)", width: "100%" }}>
        <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "5px" }}>
          <Button variant="contained" color="secondary" onClick={() => setOpenSidebar(true)} style={{ padding: "10px", width: "85px", height: "4vh", margin: "4px" }}>
            Filter
          </Button>
        </Box>
        <ReactECharts
            option={options} 
            notMerge={true} // Ensures it clears old series
            key={`${JSON.stringify(options)}`}
            style={{ height: "calc(90vh - 120px)", width: "100%", paddingBottom: "15px" }} 
            theme={isDarkMode ? "dark" : "light"}
        />

        {/* Sidebar for Filters */}
        <Drawer 
          anchor="right" 
          open={openSidebar} 
          onClose={() => setOpenSidebar(false)}
          style={{ 
            zIndex: 1202,
            overflow: 'auto',
          }}
        >
          <Box style={{ width: 400, padding: 25 }}>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Filters</Typography>
              <IconButton onClick={() => setOpenSidebar(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} centered>
              <Tab label="Time Filters" />
              <Tab label="Line Visibility" />
            </Tabs>

            {activeTab === 0 && (
            <Box style={{ overflow: 'auto' }}>
              <Box className="table-header" style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '10px', marginTop: '20px' }}>
                {/* Time Interval Dropdown */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="time-interval-label">Time Interval</InputLabel>
                  <Select labelId="time-interval-label" value={selectedHours} onChange={handleSetHours} label="Time Interval">
                    <MenuItem value="1 Hr">1 Hr</MenuItem>
                    <MenuItem value="4 Hr">4 Hr</MenuItem>
                    <MenuItem value="8 Hr">8 Hr</MenuItem>
                    <MenuItem value="12 Hr">12 Hr</MenuItem>
                    <MenuItem value="1 Day">1 Day</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                  </Select>
                </FormControl>
    
                {/* Date Pickers */}
                <TextField
                  label="From"
                  type="datetime-local"
                  value={selectedFromTime}
                  disabled={selectedHours !== "Custom"}
                  onChange={handleSetFromTime}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
    
                <TextField
                  label="To"
                  type="datetime-local"
                  value={selectedToTime}
                  disabled={selectedHours !== "Custom"}
                  onChange={handleSetToTime}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  // style={{ marginTop: 16 }}
                  onClick={handleFetchData}
                >
                  Apply
                </Button>
              </Box>
            </Box>

            )}

            {activeTab === 1 && (
            <Box style={{ overflow: 'auto', }}>
              <Box className="table-header" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                {/* Preset Selection */}
                <Typography variant="subtitle1" style={{ marginBottom: 2, marginLeft: 2 }}>Presets</Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Select
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Select Preset</MenuItem>
                    {presets.map(preset => (
                      <MenuItem key={preset.id} value={preset.id}>{preset.name}</MenuItem>
                    ))}
                  </Select>
                  <Button variant="contained" onClick={handleApplyPreset}>Apply</Button>
                </Box>

                {/* Delete Preset */}
                {selectedPresetId && (
                  <Button variant="outlined" color="error" sx={{mb:2}} onClick={() => handleDeletePreset(selectedPresetId)}>
                    Delete Preset
                  </Button>
                )}

                {/* Save New Preset */}
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    label="New Preset Name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={handleSavePreset}>Save</Button>
                </Box>

                {/* Category Dropdown */}
                <FormControl fullWidth style={{ marginBottom: 10 }} variant="outlined">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select labelId="category-label" value={tempSelectedCategory} onChange={(e) => setTempSelectedCategory(e.target.value)} label="Category">
                    <MenuItem value="">All</MenuItem>
                    {[...new Set(originalData.map((d) => d.Category))].map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Name Checkboxes */}
                <Typography variant="subtitle1" style={{ marginLeft: 2 }}>Select Lines:</Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Object.values(tempSelectedNames).every(Boolean)} // true if all selected
                      indeterminate={
                        Object.values(tempSelectedNames).some(Boolean) && 
                        !Object.values(tempSelectedNames).every(Boolean) // partially selected
                      }
                      onChange={(e) => {
                        const newState = Object.keys(tempSelectedNames)
                          .reduce((acc, name) => ({ ...acc, [name]: e.target.checked }), {});
                        setTempSelectedNames(newState);
                      }}
                    />
                  }
                  label={<Typography style={{ fontWeight: "bold" }}>Select All</Typography>}
                />

                <FormGroup style={{ marginLeft: "15px" }}>
                  {visibleNames.map((name) => (
                    <FormControlLabel
                      key={name}
                      control={
                        <Checkbox
                          checked={tempSelectedNames[name]}
                          onChange={() => setTempSelectedNames((prev) => ({ ...prev, [name]: !prev[name] }))}
                        />
                      }
                      label={
                        <Typography style={{ color: "inherit" }}>
                          {name}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>

                {/* Apply Button */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: 16 }}
                  onClick={() => applyFilters()}
                >
                  Apply
                </Button>
              </Box>
            </Box>
            )}
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;