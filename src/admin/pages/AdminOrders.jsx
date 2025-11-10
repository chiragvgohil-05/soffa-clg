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

                    // Get the proper order date with fallbacks
                    const orderDate = order.orderDate || order.paidAt || order.createdAt;

                    return {
                        id: order._id,
                        user: order.user?.name || "Unknown",
                        email: order.user?.email || "N/A",
                        phone: shipping.phone || order.user?.mobile || "N/A",
                        address: shipping.address || order.user?.address || "N/A",
                        city: shipping.city || "",
                        state: shipping.state || "",
                        pincode: shipping.pincode || "",
                        amount: order.totalAmount,
                        status: order.status,
                        date: new Date(orderDate).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        orderDate: orderDate, // Store the raw date for modal
                        paidAt: order.paidAt, // Store payment date
                        createdAt: order.createdAt, // Store creation date
                        orderId: order.razorpayOrderId || `ORD-${order._id.toString().slice(-6)}`,
                        items: order.items || [],
                        // Store original order for detailed view
                        originalOrder: order
                    };
                });
                setOrders(mappedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
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
            toast.error("Failed to delete order");
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
            order.orderId.toLowerCase().includes(search.toLowerCase()) ||
            order.email.toLowerCase().includes(search.toLowerCase())
    );

    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getOrderTimeline = (order) => {
        const timeline = [];

        if (order.createdAt) {
            timeline.push({
                event: "Order Created",
                date: order.createdAt,
                formattedDate: formatDate(order.createdAt)
            });
        }

        if (order.orderDate && order.orderDate !== order.createdAt) {
            timeline.push({
                event: "Order Placed",
                date: order.orderDate,
                formattedDate: formatDate(order.orderDate)
            });
        }

        if (order.paidAt) {
            timeline.push({
                event: "Payment Completed",
                date: order.paidAt,
                formattedDate: formatDate(order.paidAt)
            });
        }

        // Sort by date
        return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const renderStatus = (status) => {
        const statusConfig = {
            completed: { className: "completed", icon: <FaCheckCircle />, text: "Completed" },
            processing: { className: "processing", icon: <FaClock />, text: "Processing" },
            pending: { className: "pending", icon: <FaClock />, text: "Pending" },
            failed: { className: "failed", icon: <FaExclamationCircle />, text: "Failed" },
            cancelled: { className: "failed", icon: <FaExclamationCircle />, text: "Cancelled" }
        };

        const config = statusConfig[status.toLowerCase()] || {
            className: "pending",
            icon: <FaClock />,
            text: status
        };

        return (
            <span className={`status ${config.className}`}>
                {config.icon} {config.text}
            </span>
        );
    };

    if (loading) return <div className="payment-container">Loading orders...</div>;

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h2 className="page-title">Orders ({orders.length})</h2>
                <div className="payment-search-bar">
                    <FaSearch className="payment-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by customer, order ID, or email..."
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
                        <th>Order Date</th>
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
                                <td className="order-id">{order.orderId}</td>
                                <td>
                                    <div className="customer-info">
                                        <strong>{order.user}</strong>
                                        <small>{order.email}</small>
                                    </div>
                                </td>
                                <td>{order.items.length}</td>
                                <td className="amount">
                                    {formatAmount(order.amount)}
                                </td>
                                <td>{renderStatus(order.status)}</td>
                                <td className="order-date">{order.date}</td>
                                <td style={{display:"flex", gap:"0.5rem"}}>
                                    <button
                                        onClick={() => handleViewClick(order)}
                                        className="payment-view-btn"
                                        title="View Details"
                                    >
                                        <FaEye /> View
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(order)}
                                        className="payment-delete-btn"
                                        title="Delete Order"
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
                                    <span>Email:</span>
                                    <span>{order.email}</span>
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
                                    <span>Order Date:</span>
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
                title={`Order Details - ${selectedOrder?.orderId}`}
                size="large"
            >
                {selectedOrder ? (
                    <div className="order-details-modal">
                        <div className="order-timeline">
                            <h4>Order Timeline</h4>
                            {getOrderTimeline(selectedOrder).map((timelineItem, index) => (
                                <div key={index} className="timeline-item">
                                    <span className="timeline-event">{timelineItem.event}:</span>
                                    <span className="timeline-date">{timelineItem.formattedDate}</span>
                                </div>
                            ))}
                        </div>

                        <div className="details-section">
                            <h3>Customer Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <strong>Name:</strong> {selectedOrder.user}
                                </div>
                                <div className="info-item">
                                    <strong>Email:</strong> {selectedOrder.email}
                                </div>
                                <div className="info-item">
                                    <strong>Phone:</strong> {selectedOrder.phone}
                                </div>
                                <div className="info-item full-width">
                                    <strong>Address:</strong> {selectedOrder.address}
                                    {selectedOrder.city && `, ${selectedOrder.city}`}
                                    {selectedOrder.state && `, ${selectedOrder.state}`}
                                    {selectedOrder.pincode && ` - ${selectedOrder.pincode}`}
                                </div>
                            </div>
                        </div>

                        <div className="details-section">
                            <h3>Order Items</h3>
                            <table className="product-table">
                                <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedOrder.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product?.name || "Product Name Not Available"}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatAmount(item.price)}</td>
                                        <td>{formatAmount(item.quantity * item.price)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold'}}>Total Amount:</td>
                                    <td style={{fontWeight: 'bold'}}>{formatAmount(selectedOrder.amount)}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="details-section">
                            <h3>Order Summary</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <strong>Order Status:</strong>
                                    {renderStatus(selectedOrder.status)}
                                </div>
                                <div className="info-item">
                                    <strong>Order ID:</strong> {selectedOrder.orderId}
                                </div>
                                <div className="info-item">
                                    <strong>Payment Status:</strong>
                                    {selectedOrder.paidAt ? "Paid" : "Pending"}
                                </div>
                                {selectedOrder.paidAt && (
                                    <div className="info-item">
                                        <strong>Paid At:</strong> {formatDate(selectedOrder.paidAt)}
                                    </div>
                                )}
                            </div>
                        </div>
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
                    Are you sure you want to delete the order from{" "}
                    <strong>{selectedOrder?.user}</strong>?
                </p>
                <div className="order-delete-info">
                    <p><strong>Order ID:</strong> {selectedOrder?.orderId}</p>
                    <p><strong>Amount:</strong> {selectedOrder && formatAmount(selectedOrder.amount)}</p>
                </div>
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
                        Delete Order
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminOrders;