import /*React,*/ { useState } from 'react';
import { Table, TableCell, TableRow, TableBody, TableContainer, TableHead, TablePagination, Paper, Select, MenuItem, Switch, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from '@emotion/react';
import axios from 'axios';

function UserTable({ data, role, accessToken, onLoad }) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(new Set());
  const [editedRoles, setEditedRoles] = useState();

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (rowId, currentRole) => {
    setEditMode((prev) => new Set(prev).add(rowId)); // Add row to edit mode
    setEditedRoles((prev) => ({ ...prev, [rowId]: currentRole }));
  };

  const handleSaveClick = async (rowId) => {
    try {
      await axios.put("http://127.0.0.1:8000/edit-user", { id: rowId, role_id: editedRoles[rowId] }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEditMode((prev) => {
        const updatedEditMode = new Set(prev);
        updatedEditMode.delete(rowId);
        return updatedEditMode;
      });
      onLoad();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleToggleStatus = async (rowId) => {
    try {
      const res = await fetch("http://localhost:8000/toggle-user-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Replace with actual token logic
        },
        body: JSON.stringify({ id: rowId }),
      });
  
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        onLoad();
      } else {
        alert(result.detail || "Something went wrong");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDeleteClick = async (rowId) => {
    try {
      await axios.delete("http://127.0.0.1:8000/delete-user", {
        data: { id: rowId },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onLoad();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Paper elevation={1} sx={{ width: '100%', height: 'calc(100vh - 130px)', overflow: 'hidden', zIndex: 1200 }}>
      <TableContainer sx={{ height: "calc(90vh - 125px)", mt: 1, overflow: "auto" }}>
        <Table stickyHeader aria-label="sticky table">
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell 
                style={{ borderBottom: "none", borderRight: "none", borderLeft: "none", width: "80px", minWidth: "80px", maxWidth: "80px" }}
                sx={{
                  backgroundColor: darkMode ? "#005da2" : "#005da2", // Darker blue for dark mode
                  borderColor: "#005da2",
                  color: darkMode ? "#ffffff" : "#fdfefe",
                }}
              >
                User Id
              </TableCell>
              <TableCell 
                style={{ borderBottom: "none", borderRight: "none", borderLeft: "none", width: "250px", minWidth: "250px" }}
                sx={{
                  backgroundColor: darkMode ? "#005da2" : "#005da2", // Darker blue for dark mode
                  color: darkMode ? "#ffffff" : "#fdfefe",
                }}
              >
                Email
              </TableCell>
              <TableCell 
                style={{ borderBottom: "none", borderRight: "none", borderLeft: "none", width: "150px", minWidth: "150px" }}
                sx={{
                  backgroundColor: darkMode ? "#005da2" : "#005da2", // Darker blue for dark mode
                  color: darkMode ? "#ffffff" : "#fdfefe",
                }}
              >
                User Group
              </TableCell>
              <TableCell 
                style={{ borderBottom: "none", borderRight: "none", borderLeft: "none", width: "100px", minWidth: "100px" }}
                sx={{
                  backgroundColor: darkMode ? "#005da2" : "#005da2", // Darker blue for dark mode
                  color: darkMode ? "#ffffff" : "#fdfefe",
                }}
              >
                Account Status
              </TableCell>
              <TableCell 
                style={{ borderBottom: "none", borderRight: "none", borderLeft: "none", width: "100px", minWidth: "100px" }}
                sx={{
                  backgroundColor: darkMode ? "#005da2" : "#005da2", // Darker blue for dark mode
                  color: darkMode ? "#ffffff" : "#fdfefe",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow
                // role="checkbox"
                // tabIndex={-1}
                key={row.id}
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
                  <TableCell sx={{ borderBottom: "none", borderRight: "none", borderLeft: "none", padding: "10px 16px" }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", borderRight: "none", borderLeft: "none", padding: "10px 16px" }}>
                    {row.email}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", borderRight: "none", borderLeft: "none", padding: "10px 16px" }}>
                    {editMode.has(row.id) ? (
                      <Select
                        size="small"
                        value={editedRoles[row.id] || row.role_id}
                        onChange={(e) => setEditedRoles((prev) => ({ ...prev, [row.id]: e.target.value }))}
                        sx={{
                          width: "100px",
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "left",
                            fontSize: 14,
                          },
                        }}
                      >
                        {role === 1
                          ? [
                              <MenuItem key="admin" value={2} sx={{ fontSize: 14 }}>Admin</MenuItem>,
                              <MenuItem key="manager" value={3} sx={{ fontSize: 14 }}>Manager</MenuItem>,
                              <MenuItem key="engineer" value={4} sx={{ fontSize: 14 }}>Engineer</MenuItem>,
                              <MenuItem key="operator" value={5} sx={{ fontSize: 14 }}>Operator</MenuItem>
                            ]
                          : role === 2
                          ? [
                              <MenuItem key="manager" value={3} sx={{ fontSize: 14 }}>Manager</MenuItem>,
                              <MenuItem key="engineer" value={4} sx={{ fontSize: 14 }}>Engineer</MenuItem>,
                              <MenuItem key="operator" value={5} sx={{ fontSize: 14 }}>Operator</MenuItem>
                            ]
                          : null
                        }
                      </Select>
                    ) : (
                      row.role_id === 1 ? "SuperAdmin" : row.role_name
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", borderRight: "none", borderLeft: "none", padding: "10px 16px" }}>
                    <Switch
                      checked={row.is_active}
                      onChange={() => handleToggleStatus(row.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none", borderRight: "none", borderLeft: "none", padding: "10px 16px" }}>
                    {editMode.has(row.id) ? (
                      <>
                        <IconButton color="success" onClick={() => handleSaveClick(row.id)}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => setEditMode((prev) => new Set([...prev].filter((id) => id !== row.id)))}>
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton color="primary" onClick={() => handleEditClick(row.id, row.role_id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
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
          sx={{
            height: '10vh',
            borderTop: '1px solid #ddd', // Adds a subtle top border only above pagination
            color: 'inherit',
        }}
      />
    </Paper>
  );
}

export default UserTable;