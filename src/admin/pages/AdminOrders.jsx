import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";
import "../styles/Payment.css";
import {
    FaCheckCircle,
    FaClock,
    FaExclamationCircle,
    FaSearch,
    FaTrash,
    FaEye,
} from "react-icons/fa";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await apiClient.get("/admin/orders");
                const mappedOrders = res.data.orders.map((order) => {
                    const shipping = order.shippingAddress || {};
                    return {
                        id: order._id,
                        user: order.user?.name || "Unknown",
                        email: order.user?.email || "N/A",
                        phone: shipping.phone || order.user?.mobile || "N/A", // fallback to user.mobile
                        address: shipping.address || order.user?.address || "N/A", // fallback to user.address
                        city: shipping.city || "",
                        state: shipping.state || "",
                        pincode: shipping.pincode || "",
                        amount: order.totalAmount,
                        status: order.status,
                        date: new Date(order.createdAt).toLocaleString(),
                        orderId: order.razorpayOrderId || "N/A",
                        items: order.items || [],
                    };
                });
                setOrders(mappedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleDeleteClick = (order) => {
        setSelectedOrder(order);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedOrder) return;
        try {
            await apiClient.delete(`/admin/orders/${selectedOrder.id}`);
            setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
            toast.success("Order deleted successfully");
        } catch (error) {
            console.error("Error deleting order:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedOrder(null);
        }
    };

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.user.toLowerCase().includes(search.toLowerCase()) ||
            order.orderId.toLowerCase().includes(search.toLowerCase())
    );

    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount);

    const renderStatus = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return (
                    <span className="status completed">
                        <FaCheckCircle /> Completed
                    </span>
                );
            case "pending":
                return (
                    <span className="status pending">
                        <FaClock /> Pending
                    </span>
                );
            case "failed":
                return (
                    <span className="status failed">
                        <FaExclamationCircle /> Failed
                    </span>
                );
            case "cancelled":
                return (
                    <span className="status failed">
                        <FaExclamationCircle /> Cancelled
                    </span>
                );
            default:
                return <span className="status">{status}</span>;
        }
    };

    if (loading) return <div className="payment-container">Loading orders...</div>;

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h2 className="page-title">Orders</h2>
                <div className="payment-search-bar">
                    <FaSearch className="payment-search-icon" />
                    <input
                        type="text"
                        placeholder="Search orders..."
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
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="no-results">
                                No orders found
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.orderId}</td>
                                <td>{order.user}</td>
                                <td>{order.items.length}</td>
                                <td className="amount">
                                    {formatAmount(order.amount)}
                                </td>
                                <td>{renderStatus(order.status)}</td>
                                <td>{order.date}</td>
                                <td style={{display:"flex", gap:"0.5rem"}}>
                                    <button
                                        onClick={() => handleViewClick(order)}
                                        className="payment-view-btn"
                                    >
                                        <FaEye /> View
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(order)}
                                        className="payment-delete-btn"
                                    >
                                        <FaTrash /> Delete
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
                {filteredOrders.length === 0 ? (
                    <div className="no-results">No orders found</div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="payment-card">
                            <div className="card-header">
                                <div className="payment-id">{order.orderId}</div>
                                {renderStatus(order.status)}
                            </div>
                            <div className="card-details">
                                <div className="detail-row">
                                    <span>Customer:</span>
                                    <span>{order.user}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Items:</span>
                                    <span>{order.items.length}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Amount:</span>
                                    <span className="amount">
                                        {formatAmount(order.amount)}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span>Date:</span>
                                    <span>{order.date}</span>
                                </div>
                            </div>
                            <div className="mobile-actions">
                                <button
                                    onClick={() => handleViewClick(order)}
                                    className="payment-view-btn mobile"
                                >
                                    <FaEye /> View
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(order)}
                                    className="payment-delete-btn mobile"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 🧾 View Order Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Order Details"
                size="large"
            >
                {selectedOrder ? (
                    <div className="order-details-modal">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> {selectedOrder.user}</p>
                        <p><strong>Email:</strong> {selectedOrder.email}</p>
                        <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                        <p>
                            <strong>Address:</strong> {selectedOrder.address}
                        </p>


                        <hr style={{ margin: "1rem 0" }} />

                        <h3>Products</h3>
                        <table className="product-table">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedOrder.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product?.name || "Product"}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatAmount(item.price)}</td>
                                    <td>{formatAmount(item.quantity * item.price)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <hr style={{ margin: "1rem 0" }} />
                        <p><strong>Total Amount:</strong> {formatAmount(selectedOrder.amount)}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <p><strong>Order Date:</strong> {selectedOrder.date}</p>
                    </div>
                ) : (
                    <p>No order selected</p>
                )}
            </Modal>

            {/* 🗑️ Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
                size="small"
            >
                <p>
                    Are you sure you want to delete{" "}
                    <strong>{selectedOrder?.user}</strong>'s order?
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
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminOrders;
