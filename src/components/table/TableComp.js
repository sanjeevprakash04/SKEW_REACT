import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Typography, Button, Drawer, IconButton, MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function MainTable({data}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [timeInterval, setTimeInterval] = useState("1 Hr");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
    <Paper sx={{ width: '100%', height: 'calc(100vh - 179px)', overflow: 'hidden' }}>
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
      <TableContainer sx={{ height: 'calc(90vh - 185px)' }}>
          <Table stickyHeader aria-label="sticky table">
              <TableHead>
                  <TableRow>
                      {columns.map((column) => (
                          <TableCell
                              key={column}
                              align={column.align}
                              style={{ minWidth: column.minWidth, borderBottom: 'none', borderRight: 'none', borderLeft: 'none' }}
                              sx={{ backgroundColor: '#103786', color: '#fdfefe'}}
                          >
                              {column}
                          </TableCell>
                      ))}
                  </TableRow>
              </TableHead>
              <TableBody sx={{ overflow: 'auto' }}>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ backgroundColor: index % 2 === 0 ? '#eef2f7' : '#ffffff', '&:hover': { backgroundColor: '#dfe6ee' } }}>
                          {columns.map((column) => (
                              <TableCell key={column} align={column.align} sx={{ borderBottom: 'none', borderRight: 'none', borderLeft: 'none', padding: '10px 16px' }}>{row[column]}</TableCell>
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
            height: 'calc(10vh - 40px)',
            borderTop: '1px solid #ddd', // Adds a subtle top border only above pagination
            backgroundColor: '#ffffff'
        }}
      />

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

          {/* Filter Section */}
          <div className="table-header" style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px', marginTop: '40px' }}>
            {/* Time Interval Dropdown */}
            <FormControl>
              <InputLabel>Time Interval</InputLabel>
              <Select value={timeInterval} onChange={(e) => setTimeInterval(e.target.value)}>
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
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="To"
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </div>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 16 }}
            // onClick={applyFilters}
          >
            Apply
          </Button>
        </div>
      </Drawer>
    </Paper>
  );
}

export default MainTable;