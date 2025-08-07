// import React from 'react';
import { Table, TableCell, TableRow, TableBody, TableContainer, TableHead } from "@mui/material";
import { useTheme } from '@emotion/react';

function LiveTable({data}) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  // Extract column names dynamically from data
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <TableContainer sx={{ height: "100%", width: '100%',
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
                {data.map((row, index) => (
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
  );
}

export default LiveTable;