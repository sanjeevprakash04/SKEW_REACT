import './Export.css';
import React, {useState} from 'react';

function Export(){

    // Dummy Data (You can replace it with API data)
    const totalData = Array.from({ length: 100 }, (_, i) => ({
        date: "12-Dec-2024",
        time: `23:${59 - (i % 60)}:27`,
        vdc: 0,
        idc: 0,
    }));

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Calculate Total Pages
    const totalPages = Math.ceil(totalData.length / rowsPerPage);

    // Get Data for Current Page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayedData = totalData.slice(startIndex, startIndex + rowsPerPage);

    // Date-Time & Interval States
    const [timeInterval, setTimeInterval] = useState("1 Hr");
    const [fromDate, setFromDate] = useState("2024-01-01T00:00");
    const [toDate, setToDate] = useState("2024-01-01T00:00");

    // Handle Page Change
    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle Rows Per Page Change
    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    return (
        <div className='export'>
            <div className="export-title-content">
                <h1 className="export-title">Historical Data</h1>
                <div className="buttons">
                    <button className="b1">View</button>
                    <button className="b1">Graph</button>
                    <button className="b1">Export</button>
                    <button className="b1">Download</button>
                </div>
            </div>
            <hr></hr>
            <div className='export-table-content'>
                <div className="table-header">
                    <div className="filter-section">
                        <select className="dropdown" value={timeInterval} onChange={(e) => setTimeInterval(e.target.value)}>
                            <option value="1 Hr">1 Hr</option>
                            <option value="6 Hr">6 Hr</option>
                            <option value="12 Hr">12 Hr</option>
                            <option value="1 Day">1 Day</option>
                        </select>

                        <span>From:</span>
                        <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />

                        <span>To:</span>
                        <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>VDC</th>
                                <th>IDC</th>
                            </tr>
                        </thead>
                        <tbody>
                        {displayedData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.date}</td>
                                    <td>{row.time}</td>
                                    <td>{row.vdc}</td>
                                    <td>{row.idc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <span>
                        Rows per page: 
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </span>
                    <span>
                        {startIndex + 1}-{Math.min(startIndex + rowsPerPage, totalData.length)} of {totalData.length}
                    </span>
                    <button className="pagination-button" onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                        ◀
                    </button>
                    <button className="pagination-button" onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Export;