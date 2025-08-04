import React, { useState, useEffect } from 'react';
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye,
    FaPlus,
    FaDownload,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUsers,
    FaChartLine
} from 'react-icons/fa';

import '../styles/AdminUserTable.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // grid or table
    const usersPerPage = 12;

    // Mock user data
    useEffect(() => {
        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                role: 'Admin',
                status: 'active',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                location: 'New York, USA',
                joinDate: '2023-01-15',
                lastActive: '2024-08-04',
                totalOrders: 45,
                totalSpent: '$2,340'
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                phone: '+1 (555) 987-6543',
                role: 'User',
                status: 'active',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                location: 'California, USA',
                joinDate: '2023-03-22',
                lastActive: '2024-08-03',
                totalOrders: 23,
                totalSpent: '$1,120'
            },
            {
                id: 3,
                name: 'Mike Chen',
                email: 'mike.chen@example.com',
                phone: '+1 (555) 456-7890',
                role: 'Moderator',
                status: 'inactive',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                location: 'Texas, USA',
                joinDate: '2023-02-08',
                lastActive: '2024-07-28',
                totalOrders: 67,
                totalSpent: '$3,450'
            },
            {
                id: 4,
                name: 'Emma Wilson',
                email: 'emma.wilson@example.com',
                phone: '+1 (555) 321-0987',
                role: 'User',
                status: 'active',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                location: 'Florida, USA',
                joinDate: '2023-05-12',
                lastActive: '2024-08-04',
                totalOrders: 12,
                totalSpent: '$890'
            },
            {
                id: 5,
                name: 'David Rodriguez',
                email: 'david.r@example.com',
                phone: '+1 (555) 654-3210',
                role: 'User',
                status: 'suspended',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                location: 'Arizona, USA',
                joinDate: '2023-04-18',
                lastActive: '2024-07-15',
                totalOrders: 8,
                totalSpent: '$456'
            },
            {
                id: 6,
                name: 'Lisa Anderson',
                email: 'lisa.anderson@example.com',
                phone: '+1 (555) 789-0123',
                role: 'Admin',
                status: 'active',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                location: 'Washington, USA',
                joinDate: '2022-11-30',
                lastActive: '2024-08-04',
                totalOrders: 156,
                totalSpent: '$8,790'
            }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
            return matchesSearch && matchesFilter;
        });

        // Sort users
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'email':
                    return a.email.localeCompare(b.email);
                case 'joinDate':
                    return new Date(b.joinDate) - new Date(a.joinDate);
                case 'lastActive':
                    return new Date(b.lastActive) - new Date(a.lastActive);
                default:
                    return 0;
            }
        });

        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [users, searchTerm, filterStatus, sortBy]);

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(currentUsers.map(user => user.id));
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'status-badge active',
            inactive: 'status-badge inactive',
            suspended: 'status-badge suspended'
        };
        return <span className={statusClasses[status]}>{status}</span>;
    };

    const getRoleBadge = (role) => {
        const roleClasses = {
            Admin: 'role-badge admin',
            Moderator: 'role-badge moderator',
            User: 'role-badge user'
        };
        return <span className={roleClasses[role]}>{role}</span>;
    };

    return (
        <div className="admin-users-container">
            {/* Header */}
            <div className="admin-header">
                <div className="header-left">
                    <h1 className="page-title">Users Management</h1>
                    <p className="page-subtitle">Manage and monitor all users in your system</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <FaDownload size={18} />
                        Export
                    </button>
                    <button className="btn btn-primary">
                        <FaPlus size={18} />
                        Add User
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <FaUsers size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{users.length}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon active">
                        <FaChartLine size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{users.filter(u => u.status === 'active').length}</h3>
                        <p>Active Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon inactive">
                        <FaUsers size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{users.filter(u => u.status === 'inactive').length}</h3>
                        <p>Inactive Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon suspended">
                        <FaUsers size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{users.filter(u => u.status === 'suspended').length}</h3>
                        <p>Suspended</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-section">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="email">Sort by Email</option>
                        <option value="joinDate">Sort by Join Date</option>
                        <option value="lastActive">Sort by Last Active</option>
                    </select>

                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            Grid
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            Table
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Display */}
            {viewMode === 'grid' ? (
                <div className="users-grid">
                    {currentUsers.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-card-header">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                    className="user-checkbox"
                                />
                                <div className="user-actions">
                                    <button className="action-btn view">
                                        <FaEye size={16} />
                                    </button>
                                    <button className="action-btn edit">
                                        <FaEdit size={16} />
                                    </button>
                                    <button className="action-btn delete">
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="user-avatar">
                                <img src={user.avatar} alt={user.name} />
                                <div className="status-indicator" data-status={user.status}></div>
                            </div>

                            <div className="user-info">
                                <h3 className="user-name">{user.name}</h3>
                                <p className="user-email">{user.email}</p>
                                <div className="user-badges">
                                    {getRoleBadge(user.role)}
                                    {getStatusBadge(user.status)}
                                </div>
                            </div>

                            <div className="user-details">
                                <div className="detail-item">
                                    <FaPhone size={14} />
                                    <span>{user.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <FaMapMarkerAlt size={14} />
                                    <span>{user.location}</span>
                                </div>
                                <div className="detail-item">
                                    <FaCalendarAlt size={14} />
                                    <span>Joined {user.joinDate}</span>
                                </div>
                            </div>

                            <div className="user-stats">
                                <div className="stat">
                                    <span className="stat-label">Orders</span>
                                    <span className="stat-value">{user.totalOrders}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Spent</span>
                                    <span className="stat-value">{user.totalSpent}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>User</th>
                            <th>Contact</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Join Date</th>
                            <th>Last Active</th>
                            <th>Orders</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
                                    />
                                </td>
                                <td>
                                    <div className="table-user-info">
                                        <img src={user.avatar} alt={user.name} className="table-avatar" />
                                        <div>
                                            <div className="table-user-name">{user.name}</div>
                                            <div className="table-user-email">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <div>{user.phone}</div>
                                        <div className="location">{user.location}</div>
                                    </div>
                                </td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>{getStatusBadge(user.status)}</td>
                                <td>{user.joinDate}</td>
                                <td>{user.lastActive}</td>
                                <td>
                                    <div className="table-stats">
                                        <div>{user.totalOrders} orders</div>
                                        <div className="spent">{user.totalSpent}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="action-btn view">
                                            <FaEye size={16} />
                                        </button>
                                        <button className="action-btn edit">
                                            <FaEdit size={16} />
                                        </button>
                                        <button className="action-btn delete">
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="pagination">
                <div className="pagination-info">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="pagination-controls">
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                                <button
                                    key={page}
                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="pagination-dots">...</span>;
                        }
                        return null;
                    })}

                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Users;