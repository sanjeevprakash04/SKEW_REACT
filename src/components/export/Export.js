import './Export.css';
import React, {useState,useEffect} from 'react';
// import axios from 'axios';
import MainTable from '../table/TableComp';
import LineChartComponent from '../linechart/LineChartComp';
import jsonData from './Skew_MFM_data.json';

function Export(){

    const [data, setData] = useState([]);
    const [activeComponent, setActiveComponent] = useState(null); // Track which component to render

    useEffect(() => {
        const jData = jsonData.data;
        setData(jData);
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