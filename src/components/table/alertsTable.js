import { useState } from 'react';
import {
  Table, TableCell, TableRow, TableBody, TableContainer, TableHead,
  TablePagination, Paper, Switch, IconButton
} from "@mui/material";
// eslint-disable-next-line
import { Delete as DeleteIcon,  Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from '@emotion/react';
import axios from 'axios';

function AlertsTable({ data, onLoad }) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleAlert = async (id) => {
    try {
        await axios.put("http://127.0.0.1:8000/toggle-alert-status", { id });
        onLoad();
    } catch (error) {
        console.error("Error toggling alert:", error);
    }
  };

  // ✅ Delete alert
  const handleDeleteAlert = async (id) => {
    try {
        await axios.delete("http://127.0.0.1:8000/delete-alert", {
            data: { id },
        });
        onLoad();
    } catch (error) {
        console.error("Error deleting alert:", error);
    }
  };

  return (
    <Paper elevation={1} sx={{ width: '100%', height: 'calc(100vh - 130px)', overflow: 'hidden' }}>
      <TableContainer sx={{ height: "calc(90vh - 125px)", mt: 1, overflow: "auto" }}>
        <Table stickyHeader aria-label="alerts table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#005da2", color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: "#005da2", color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: "#005da2", color: "#fff" }}>Condition</TableCell>
              <TableCell sx={{ backgroundColor: "#005da2", color: "#fff" }}>Active Status</TableCell>
              <TableCell sx={{ backgroundColor: "#005da2", color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: darkMode
                    ? index % 2 === 0 ? "#333" : "#444"
                    : index % 2 === 0 ? "inherit" : "#eee",
                }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.condition}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={row.isActive}
                    onChange={() => handleToggleAlert(row.id)}
                  />
                </TableCell>
                <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteAlert(row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
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
      />
    </Paper>
  );
}

export default AlertsTable;