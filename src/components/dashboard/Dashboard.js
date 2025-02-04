import React, {useState} from "react";
import "./Dashboard.css";
import axios from "axios";

function Dashboard({connection}) {
    const totalData = Array.from({ length: 25 }, (_, i) => ({
        date: "12-Dec-2024",
        time: `23:${59 - (i % 60)}:27`,
        vdc: 0,
        idc: 0,
    }));

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState();
    const [message, setMessage] = useState("");

    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayedData = totalData.slice(startIndex);

    const handleClick = async () => {
        console.log("Driver:", connection.driver);
        console.log("IP Address:", connection.ipAddress);

        try {
            const response = await axios.post("http://127.0.0.1:8000/plc-connect", {
                ip: connection.ipAddress,  // Send IP Address
                driver: connection.driver, // Send selected driver
            });

            console.log("Connection Response:", response.data);
            setMessage(response.data.response || "PLC Connected Successfully!");
        } catch (error) {
            console.error("Connection Error:", error);
            setMessage("Error connecting to PLC: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-title-content">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="buttons">
                    <button className="b1" onClick={handleClick}>Connect</button>
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
                            <p>{message}</p>
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
