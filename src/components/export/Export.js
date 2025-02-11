import './Export.css';
import React, {useState,useEffect} from 'react';
import axios from 'axios';
import MainTable from '../table/TableComp';
import LineChartComponent from '../linechart/LineChartComp';

function Export(){

    const [data, setData] = useState([]);
    const [activeComponent, setActiveComponent] = useState(null); // Track which component to render

    useEffect(() => {
    axios.get("http://127.0.0.1:8000/get-json-data")
        .then((response) => {
            setData(response.data.data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    }, []);

    return (
        <div className='export'>
            <div className="export-title-content">
                <h1 className="export-title">Historical Data</h1>
                <div className="buttons">
                    <button className="b1" onClick={() => setActiveComponent('table')}>View</button>
                    <button className="b1" onClick={() => setActiveComponent('graph')}>Graph</button>
                    <button className="b1">Export</button>
                    <button className="b1">Download</button>
                </div>
            </div>
            <hr></hr>
            <div className='export-table-content'>
                {activeComponent === 'table' && <MainTable data={data} />}
                {activeComponent === 'graph' && <LineChartComponent data={data} />}   
            </div>
        </div>
    );
}

export default Export;