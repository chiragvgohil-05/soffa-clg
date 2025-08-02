import React, { useState, useEffect } from 'react';
import '../styles/AdminUserTable.css';
import Modal from '../../components/Modal'; // Ensure this path is correct

const Users = () => {
    const initialUsers = [/* your sample user data here */];

    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (searchTerm === '') {
            setUsers(initialUsers);
        } else {
            const filteredUsers = initialUsers.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setUsers(filteredUsers);
        }
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleView = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="admin-user-container">
            <h2>User Management</h2>

            <input
                type="text"
                placeholder="Search users..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table className="admin-user-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentUsers.length > 0 ? (
                    currentUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td className={`status-${user.status}`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </td>
                            <td>{user.joinDate}</td>
                            <td>
                                <button className="action-btn view-btn" onClick={() => handleView(user)}>View</button>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(user)}>Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>No users found</td>
                    </tr>
                )}
                </tbody>
            </table>

            {users.length > usersPerPage && (
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={currentPage === number ? 'active' : ''}
                        >
                            {number}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}

            {/* View Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="User Details">
                {selectedUser && (
                    <div>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        <p><strong>Status:</strong> {selectedUser.status}</p>
                        <p><strong>Join Date:</strong> {selectedUser.joinDate}</p>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
                <p>Are you sure you want to delete <strong>{selectedUser?.name}</strong>?</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#ccc', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#e74c3c', color: '#fff', cursor: 'pointer' }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Users;
