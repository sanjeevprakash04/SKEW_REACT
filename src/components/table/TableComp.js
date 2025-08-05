import React, { useState, useMemo } from 'react';
import { Typography, Button, Drawer, IconButton, MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Table, TableCell, TableRow, TableBody, TableContainer, TableHead, TablePagination, Paper } from "@mui/material";
import { useTheme } from '@emotion/react';

function MainTable({data, fetchData, hours, setHours, fromTime, setFromTime, toTime, setToTime, setActiveComponent}) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedHours, setSelectedHours] = useState(hours);
  const [selectedFromTime, setSelectedFromTime] = useState(fromTime);
  const [selectedToTime, setSelectedToTime] = useState(toTime);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.TimeStamp && b.TimeStamp) {
        return new Date(b.TimeStamp) - new Date(a.TimeStamp); // Sort by timestamp (newest first)
      } else if (a.Id && b.Id) {
        return b.Id - a.Id; // Sort by numeric ID if timestamp isn't available
      }
      return 0; // No sorting if neither timestamp nor ID exists
    });
  }, [data]);

  const handleSetHours = (e) => {
    setSelectedHours(e.target.value);
  }

  const handleSetFromTime = (e) => {
    setSelectedFromTime(e.target.value);
  }

  const handleSetToTime = (e) => {
    setSelectedToTime(e.target.value);
  }

  const handleFetch = () => {
    const updatedFilters = {
      hours: selectedHours,
      fromTime: selectedFromTime,
      toTime: selectedToTime,
    };
    setHours(updatedFilters.hours);
    setFromTime(updatedFilters.fromTime);
    setToTime(updatedFilters.toTime);
    fetchData(updatedFilters.hours, updatedFilters.fromTime, updatedFilters.toTime);
    setActiveComponent('table');
    setOpenSidebar(false);
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Extract column names dynamically from data
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Paper elevation={1} sx={{ width: '100%', height: 'calc(100vh - 130px)', overflow: 'hidden' }}>
      <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '5px' }}>
        <Button 
          variant="contained" 
          color='secondary'
          onClick={toggleSidebar}
          style={{ padding: '10px', width: '85px', height: '4vh', margin: '4px', marginRight: '20px', marginTop: '20px'}} 
        >
          Filter
        </Button>
      </Box>
      <TableContainer sx={{ height: "calc(90vh - 165px)",
        mt: 1,
        overflow: "auto",
       }}>
        <Table stickyHeader aria-label="sticky table">
          {/* Table Header */}
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  align="left"
                  style={{ minWidth: 100, borderBottom: "none", borderRight: "none", borderLeft: "none" }}
                  sx={{
                    backgroundColor: darkMode ? "#005da2" : "#005da2", // Darker blue for dark mode
                    color: darkMode ? "#ffffff" : "#fdfefe",
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow
                role="checkbox"
                tabIndex={-1}
                key={index}
                sx={{
                  backgroundColor: darkMode
                    ? index % 2 === 0
                      ? "#333" // Dark gray for even rows
                      : "#444" // Slightly lighter gray for odd rows
                    : index % 2 === 0
                    ? "inherit"
                    : "#eee", // Light gray for odd rows
                  color: darkMode ? "#ffffff" : "#000000", // Text color adjusts
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    align="left"
                    sx={{
                      borderBottom: "none",
                      borderRight: "none",
                      borderLeft: "none",
                      padding: "10px 16px",
                    }}
                  >
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            height: 'calc(10vh - 10px)',
            borderTop: '1px solid #ddd', // Adds a subtle top border only above pagination
            color: 'inherit',
        }}
      />

      {/* Sidebar for Filters */}
      <Drawer
        anchor="right"
        open={openSidebar}
        onClose={toggleSidebar}
        style={{ 
          position: 'absolute',
          overflow: 'auto', 
          zIndex: 1202,
        }}
      >
        <Box style={{ width: 400, padding: 35 }}>
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleSidebar}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Filter Section */}
          <Box className="table-header" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', marginTop: '40px' }}>
            {/* Time Interval Dropdown */}
            <FormControl>
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
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 5 }}
            onClick={handleFetch}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </Paper>
  );
}

export default MainTable;