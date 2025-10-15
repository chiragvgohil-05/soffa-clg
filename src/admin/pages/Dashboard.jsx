import React, { useState, useEffect } from "react";
import {
    FaUsers,
    FaBoxOpen,
    FaMoneyBillWave,
    FaShoppingCart,
    FaSearch,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";
import request from "../../apiClient";
import "../styles/Dashboard.css";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const Dashboard = () => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };
    const stats = [
        {
            title: "Total Users",
            value: dashboardStats ? dashboardStats?.totalUsers : 0,
            icon: <FaUsers />,
            color: "#4f46e5",
        },
        {
            title: "Products Created",
            value: dashboardStats ? dashboardStats?.totalProducts : 0,
            icon: <FaBoxOpen />,
            color: "#10b981",
        },
        {
            title: "Total Payments",
            value: dashboardStats ? dashboardStats?.totalRevenue : 0,
            icon: <FaMoneyBillWave />,
            color: "#f59e0b",
        }
    ];
    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        try {
            await request.delete(`/auth/users/${selectedUser._id}`);
            setUsers((prev) =>
                prev.filter((user) => user._id !== selectedUser._id)
            );
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
            toast.success("User deleted successfully."); // optionally replace with toast
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error("Failed to delete user.");
        }
    };
    // ✅ Fetch users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await request.get("/auth/users"); // 🔥 backend call
                setUsers(res.data.data); // backend sends { status, message, data }
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const res = await request.get("/admin/dashboard"); // 🔥 backend call
                setDashboardStats(res.data.data); // { totalUsers, totalProducts }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            }
        };

        fetchDashboardStats();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user._id?.toLowerCase().includes(search.toLowerCase())
    );
    const renderStatus = (lastLogin) => {
        if (lastLogin) {
            return (
                <span className="status completed">
          <FaCheckCircle /> Active
        </span>
            );
        }
        return (
            <span className="status failed">
        <FaTimesCircle /> Inactive
      </span>
        );
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

            <div className="payment-container" style={{ marginTop: "60px" }}>
                <div className="payment-header">
                    <h2 className="page-title">User List</h2>
                    <div className="payment-search-bar">
                        <FaSearch className="payment-search-icon" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading users...</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="payment-table-container">
                            <table className="payment-table">
                                <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="no-results">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>{renderStatus(user.lastLogin)}</td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => openDeleteModal(user)}
                                                    disabled={user.role === "Admin"}
                                                    title={user.role === "Admin" ? "Cannot delete admin" : ""}
                                                    style={{
                                                        padding: "6px 10px",
                                                        backgroundColor: user.role === "Admin" ? "#ccc" : "#ef4444",
                                                        color: user.role === "Admin" ? "#666" : "#fff",
                                                        cursor: user.role === "Admin" ? "not-allowed" : "pointer",
                                                        opacity: user.role === "Admin" ? 0.6 : 1,
                                                        border: "none",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
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
                                filteredUsers.map((user) => (
                                    <div key={user._id} className="payment-card">
                                        <div className="card-header">
                                            <div className="payment-id">{user._id}</div>
                                            {renderStatus(user.lastLogin)}
                                        </div>
                                        <div className="card-details">
                                            <div className="detail-row">
                                                <span>Name:</span>
                                                <span>{user.name}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span>Email:</span>
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span>Joined:</span>
                                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
                size="small"
            >
                <p>
                    Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
                </p>
                <div className="modal-actions">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="delete-btn"
                        style={{width:"fit-content"}}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Dashboard;
