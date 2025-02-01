import React from "react";
import "./Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="dashboard-title-content">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="buttons">
                    <button className="b1">Connect</button>
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

                        </div>
                    </div>
                    <div className="widget">
                        <span>Data Table</span>
                        <div className="table-view">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
