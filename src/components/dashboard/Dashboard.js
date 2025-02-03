import React, {useState} from "react";
import "./Dashboard.css";

function Dashboard({onSubmit}) {
    const totalData = Array.from({ length: 25 }, (_, i) => ({
        date: "12-Dec-2024",
        time: `23:${59 - (i % 60)}:27`,
        vdc: 0,
        idc: 0,
    }));

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState();

    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayedData = totalData.slice(startIndex);

    return (
        <div className="dashboard">
            <div className="dashboard-title-content">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="buttons">
                    <button className="b1" onClick={onSubmit}>Connect</button>
                    <button className="b1">Disconnect</button>
                </div>
            </div>
            <hr></hr>
            <div className="dashboard-widgets">
                <div className="widget-upper">
                    <div className="widget">
                        <span>Bar Chart</span>
                        <div className="chart-view">

                        </div>
                    </div>
                    <div className="widget">
                        <span>Data Meter</span>
                        <div className="meter-view">

                        </div>
                    </div>
                </div>
                <div className="widget-lower">
                    <div className="widget">
                        <span>Log Details</span>
                        <div className="log-view">
                            <p>No logs to display</p>
                        </div>
                    </div>
                    <div className="widget">
                        <span>Data Table</span>
                        <div className="table-view">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
