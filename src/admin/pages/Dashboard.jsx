import React, {useState} from 'react';
import {
    FaUsers,
    FaBoxOpen,
    FaMoneyBillWave,
    FaShoppingCart, FaSearch, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const stats = [
        { title: 'Total Users', value: 120, icon: <FaUsers/>, color: '#4f46e5' },
        { title: 'Products Created', value: 45, icon: <FaBoxOpen/>, color: '#10b981' },
        { title: 'Total Payments', value: '₹ 1,25,000', icon: <FaMoneyBillWave/>, color: '#f59e0b' },
        { title: 'Active Orders', value: 32, icon: <FaShoppingCart/>, color: '#ef4444' }
    ];
    const users = [
        { id: 'USR001', name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', joined: '2025-07-15' },
        { id: 'USR002', name: 'Michael Smith', email: 'michael@example.com', status: 'Inactive', joined: '2025-07-10' },
        { id: 'USR003', name: 'Sophia Lee', email: 'sophia@example.com', status: 'Active', joined: '2025-06-25' },
    ];

    const [search, setSearch] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase())
    );

    const renderStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <span className="status completed"><FaCheckCircle/> Active</span>;
            case 'inactive':
                return <span className="status failed"><FaTimesCircle/> Inactive</span>;
            default:
                return <span className="status">{status}</span>;
        }
    };
    return (
        <>
            <div className="dashboard-container">
                <div className="dashboard-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="dashboard-card">
                            <div className="dashboard-icon" style={{ backgroundColor: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="details">
                                <h3>{stat.value}</h3>
                                <p>{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="payment-container" style={{marginTop: '60px'}}>
                <div className="payment-header">
                    <h2 className="page-title">User List</h2>
                    <div className="payment-search-bar">
                        <FaSearch className="payment-search-icon"/>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="payment-table-container">
                    <table className="payment-table">
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-results">No users found</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{renderStatus(user.status)}</td>
                                    <td>{user.joined}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="payment-cards">
                    {filteredUsers.length === 0 ? (
                        <div className="no-results">No users found</div>
                    ) : (
                        filteredUsers.map(user => (
                            <div key={user.id} className="payment-card">
                                <div className="card-header">
                                    <div className="payment-id">{user.id}</div>
                                    {renderStatus(user.status)}
                                </div>
                                <div className="card-details">
                                    <div className="detail-row"><span>Name:</span><span>{user.name}</span></div>
                                    <div className="detail-row"><span>Email:</span><span>{user.email}</span></div>
                                    <div className="detail-row"><span>Joined:</span><span>{user.joined}</span></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
