import './Navbar.css'
import React,{ useState } from 'react';
import Logo from './skew-logo-horizontal.png';
import Profile from './profile.jpg';

function Navbar({ toggleSidebar }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark');
    };

    return (
    <nav className="navbar">
        <div className="logo_item">
            <i className="bx bx-menu" onClick={toggleSidebar} ></i>
            <img src={Logo} alt=""></img>
        </div>

        {/* <div className="search_bar">
            <input type="text" placeholder="Search" />
        </div> */}

        <div className="navbar_content">
            <i className="bi bi-grid"></i>
            <i
                className={`bx ${isDarkMode ? 'bx-moon' : 'bx-sun'}`}
                id="darkLight"
                onClick={toggleDarkMode} 
            ></i>
            <i className='bx bx-bell' ></i>
            <img src={Profile} alt="" className="profile" />
        </div>
    </nav>
    )
}

export default Navbar;