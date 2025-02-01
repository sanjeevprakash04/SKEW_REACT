import './Sidebar.css';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isCollapsed }){

    const location = useLocation(); // Get the current path
    const currentPath = location.pathname;

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: "bx bx-home" },
        { path: "/export", label: "Historical Data", icon: "bx bx-data" },
        { path: "/log", label: "Log", icon: "bx bx-file" },
        { path: "/about", label: "About", icon: "bx bx-info-circle" },
        { path: "/settings", label: "Settings", icon: "bx bx-cog" },
    ];

    const helpItem = { path: "/help", label: "Help", icon: "bx bx-help-circle" };

    return (
        <nav className={`sidebar ${isCollapsed ? 'close' : 'open'}`}>
            <div className="menu_content">
                <ul className="menu_items">
                    {menuItems.map((item)=>(
                        <li
                            key={item.path}
                            className={`item ${currentPath === item.path ? "checked" : ""}`}
                        >
                            <Link to={item.path} className="nav_link">
                                <span className="navlink_icon">
                                    <i className={item.icon}></i>
                                </span>
                                <span className="navlink">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="bottom_content">
                    <div className="bottom" >
                        <hr></hr>
                        <ul className="menu_items">
                                <li
                                    key={helpItem.path}
                                    className={`item ${currentPath === helpItem.path ? "checked" : ""}`}
                                >
                                    <Link 
                                        to={helpItem.path} 
                                        className="nav_link"
                                    >
                                        <span className="navlink_icon">
                                            <i className={helpItem.icon}></i>
                                        </span>
                                        <span className="navlink">{helpItem.label}</span>
                                    </Link>
                                </li>
                        </ul>
                    </div>
                </div> 
            </div>
        </nav>
    )
}

export default Sidebar;