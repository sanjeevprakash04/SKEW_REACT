import './About.css';
import React from 'react';
import Logo from './logo.png';

function About() {
    return (
        <div className='about'>
            <div className="about-title-content">
                <h1 className="about-title">About</h1>
            </div>
            <hr />
            <div className='about-widgets'>
                <div className='upper-widget'>
                    <div className='image'>
                        <img className='logo' src={Logo} alt='Logo-Image' />
                    </div>
                    <div className='content'>
                        <h2>Welcome to SKEW</h2>
                        <p>SKEW is your ultimate solution for efficient data handling, analytics, and visualization from Programmable Logic Controllers (PLCs).</p>
                        <h3>Introduction:</h3>
                        <ul className='ul1'>
                            <li>SKEW is a cutting-edge software designed to streamline the process of fetching data from PLCs, empowering you to delve deep into your industrial operations. With its robust analytics engine, SKEW provides unparalleled insights into your data, uncovering trends, anomalies, and correlations that drive informed decision-making.</li>
                            <li>Visualizing your data is made easy with SKEW's intuitive interface, allowing you to explore your data in meaningful ways. Whether you're monitoring production metrics, analyzing equipment performance, or optimizing processes, our visualization tools help you grasp the full picture with clarity and precision.</li>
                            <li>Experience the next level of PLC data management with SKEW. Revolutionize your operations, maximize efficiency, and unlock the full potential of your industrial processes.</li>
                        </ul>
                        <h3>Who Can Benefit?</h3>
                        <ul className='ul2'>
                            <li><strong>Manufacturers:</strong> Streamline production processes, minimize downtime, and optimize resource utilization with real-time insights into equipment performance and production metrics.</li>
                            <li><strong>Automation Engineers:</strong> Enhance system performance and reliability by monitoring PLC data in real time and proactively addressing issues before they escalate.</li>
                            <li><strong>Plant Managers:</strong> Gain visibility into plant operations, track key performance indicators, and make data-driven decisions to improve overall efficiency and productivity.</li>
                            <li><strong>Maintenance Teams:</strong> Predict equipment failures, schedule preventive maintenance tasks, and ensure optimal equipment performance to minimize costly downtime.</li>
                        </ul>
                        <h3>Contact Us</h3>
                        <p>Email: <strong>info@proliteautomation.com</strong></p>
                    </div>
                </div>
                <div className='lower-widget'>
                    <span className='span1'>Trial Expires on: {}</span>
                    <div className='input-data'>
                        <input placeholder='Enter Licence Key' />
                        <button>Activate</button>
                    </div>
                    <span className='span2'>Software Version: v1.18</span>
                </div>
            </div>
        </div>
    );
}

export default About;