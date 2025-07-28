import React from 'react';
import '../styles/topbar.css';

const Topbar = ({ toggleSidebar }) => {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    ☰
                </button>
                <h1 className="topbar-title">Admin Panel</h1>
            </div>

            <div className="topbar-right">
                <div className="topbar-icon">
                    🔔
                    <div className="notification-badge">3</div>
                </div>
                <div className="user-profile">
                    <img
                        className="user-avatar"
                        src="https://i.pravatar.cc/100"
                        alt="User"
                    />
                    <span className="user-name">John Doe</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
