import React from 'react';
import '../styles/admin.css';

const Dashboard = () => {
    return (
        <div className="admin-content">
            <h1 className="page-title">Dashboard</h1>
            <div className="dashboard-stats">
                {/* Add your dashboard widgets here */}
                <p>Welcome to the admin dashboard!</p>
            </div>
        </div>
    );
};

export default Dashboard;