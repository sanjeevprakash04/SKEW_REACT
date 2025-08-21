import { useState } from "react";
import {
  Table, TableCell, TableRow, TableBody, TableContainer, TableHead,
  TablePagination, Paper, Switch, IconButton, TextField
} from "@mui/material";
import {
  Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Close as CloseIcon
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import axios from "axios";

function AlertsTable({ data, onLoad, showSnackbar }) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ✅ Track editing row
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", condition: "" });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleAlert = async (id) => {
    try {
      await axios.put("http://127.0.0.1:8000/toggle-alert-status", { id });
      onLoad();
      showSnackbar("Active status changed!", "success");
    } catch (error) {
      console.error("Error toggling alert:", error);
      showSnackbar("Failed to change active status", "error");
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await axios.delete("http://127.0.0.1:8000/delete-alert", { data: { id } });
      onLoad();
      showSnackbar("Alert deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting alert:", error);
      showSnackbar("Failed to delete alert", "error");
    }
  };

  // ✅ Start editing
  const handleEditClick = (row) => {
    setEditingRowId(row.id);
    setEditValues({ name: row.name, condition: row.condition });
  };

  // ✅ Save changes
  const handleSaveClick = async (id) => {
    try {
      await axios.put("http://127.0.0.1:8000/update-alert", {
        id,
        name: editValues.name,
        condition: editValues.condition,
      });
      setEditingRowId(null);
      onLoad();
      showSnackbar("Alert updated successfully!", "success");
    } catch (error) {
      console.error("Error updating alert:", error);
      showSnackbar("Failed to update alert", "error");
    }
  };

  // ✅ Cancel editing
  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditValues({ name: "", condition: "" });
  };

  return (
    <Paper elevation={1} sx={{ width: "100%", height: "calc(100vh - 170px)", overflow: "hidden" }}>
      <TableContainer sx={{ height: "calc(90vh - 160px)", mt: 1, overflow: "auto" }}>
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
                <TableCell>{row.displayId}</TableCell>

                {/* Editable Name */}
                <TableCell>
                  {editingRowId === row.id ? (
                    <TextField
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      size="small"
                    />
                  ) : (
                    row.name
                  )}
                </TableCell>

                {/* Editable Condition */}
                <TableCell>
                  {editingRowId === row.id ? (
                    <TextField
                      value={editValues.condition}
                      onChange={(e) => setEditValues({ ...editValues, condition: e.target.value })}
                      size="small"
                    />
                  ) : (
                    row.condition
                  )}
                </TableCell>

                {/* Switch */}
                <TableCell>
                  <Switch
                    checked={row.isActive}
                    onChange={() => handleToggleAlert(row.id)}
                    disabled={editingRowId === row.id} // disable while editing
                  />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  {editingRowId === row.id ? (
                    <>
                      <IconButton color="success" onClick={() => handleSaveClick(row.id)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="info" onClick={handleCancelClick}>
                        <CloseIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteAlert(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton color="primary" onClick={() => handleEditClick(row)}>
                      <EditIcon />
                    </IconButton>
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
      />
    </Paper>
  );
}

export default AlertsTable;
