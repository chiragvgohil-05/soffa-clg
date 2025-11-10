import React, { useState, useEffect } from 'react';
import apiClient from '../../apiClient';
import '../styles/Payment.css';
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaClock,
    FaCreditCard,
    FaPaypal,
    FaUniversity,
    FaSearch,
    FaTrash,
    FaEye
} from 'react-icons/fa';
import Modal from '../../components/Modal';
import toast from "react-hot-toast";

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                // Try different endpoints - adjust based on your backend
                const endpoints = [
                    "/admin/orders",
                    "/admin/payments",
                    "/cart/orders",
                    "/orders"
                ];

                let response = null;
                let lastError = null;

                // Try each endpoint until one works
                for (const endpoint of endpoints) {
                    try {
                        response = await apiClient.get(endpoint);
                        if (response.data) {
                            console.log(`Success with endpoint: ${endpoint}`, response.data);
                            break;
                        }
                    } catch (err) {
                        lastError = err;
                        console.log(`Endpoint ${endpoint} failed:`, err.message);
                        continue;
                    }
                }

                if (!response) {
                    throw lastError || new Error("No valid endpoint found");
                }

                // Handle different response structures
                const responseData = response.data;

                // Extract orders array from different possible response structures
                let ordersArray = [];

                if (responseData.orders) {
                    ordersArray = responseData.orders;
                } else if (responseData.data && responseData.data.orders) {
                    ordersArray = responseData.data.orders;
                } else if (Array.isArray(responseData)) {
                    ordersArray = responseData;
                } else if (responseData.data && Array.isArray(responseData.data)) {
                    ordersArray = responseData.data;
                } else {
                    console.error("Unexpected response structure:", responseData);
                    toast.error("Unexpected data format from server");
                    return;
                }

                if (!ordersArray || ordersArray.length === 0) {
                    setPayments([]);
                    return;
                }

                // Map orders to payment records
                const mappedPayments = ordersArray.map(order => {
                    // Get the proper date with fallbacks
                    const paymentDate = order.paidAt || order.orderDate || order.createdAt;

                    return {
                        id: order._id,
                        paymentId: order.razorpayPaymentId || `PAY-${order._id?.toString().slice(-8) || 'N/A'}`,
                        razorpayOrderId: order.razorpayOrderId,
                        name: order.user?.name || "Unknown Customer",
                        email: order.user?.email || "N/A",
                        amount: order.totalAmount || 0,
                        status: order.status || "pending",
                        date: paymentDate ? new Date(paymentDate).toLocaleDateString('en-IN') : "N/A",
                        fullDate: paymentDate ? new Date(paymentDate).toLocaleString('en-IN') : "N/A",
                        method: "Razorpay", // Default for now
                        items: order.items || [],
                        shippingAddress: order.shippingAddress || {},
                        // Store original order for details
                        originalOrder: order
                    };
                });

                setPayments(mappedPayments);
                console.log(`Loaded ${mappedPayments.length} payments`);

            } catch (err) {
                console.error("Error fetching payments:", err);
                toast.error(`Failed to load payments: ${err.response?.data?.message || err.message}`);
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const handleDeleteClick = (payment) => {
        setSelectedPayment(payment);
        setIsDeleteModalOpen(true);
    };

    const handleViewClick = (payment) => {
        setSelectedPayment(payment);
        setIsViewModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedPayment) return;
        try {
            // Try different delete endpoints
            await apiClient.delete(`/admin/orders/${selectedPayment.id}`);
            setPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
            toast.success("Payment record deleted successfully");
        } catch (err) {
            console.error("Error deleting payment:", err);
            toast.error("Failed to delete payment record");
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedPayment(null);
        }
    };

    const filteredPayments = payments.filter(payment =>
        payment.name.toLowerCase().includes(search.toLowerCase()) ||
        payment.paymentId.toLowerCase().includes(search.toLowerCase()) ||
        payment.email.toLowerCase().includes(search.toLowerCase())
    );

    const formatAmount = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);

    const renderStatus = (status) => {
        const statusConfig = {
            completed: { className: "completed", icon: <FaCheckCircle />, text: "Completed" },
            paid: { className: "completed", icon: <FaCheckCircle />, text: "Paid" },
            pending: { className: "pending", icon: <FaClock />, text: "Pending" },
            failed: { className: "failed", icon: <FaExclamationCircle />, text: "Failed" },
            cancelled: { className: "failed", icon: <FaExclamationCircle />, text: "Cancelled" },
            processing: { className: "processing", icon: <FaClock />, text: "Processing" }
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

    const renderMethodIcon = (method) => {
        switch (method.toLowerCase()) {
            case 'credit card': return <FaCreditCard className="method-icon" />;
            case 'paypal': return <FaPaypal className="method-icon" />;
            case 'bank transfer': return <FaUniversity className="method-icon" />;
            case 'razorpay': return <FaCreditCard className="method-icon" />;
            default: return <FaCreditCard className="method-icon" />;
        }
    };

    if (loading) return (
        <div className="payment-container">
            <div className="loading-state">Loading payments...</div>
        </div>
    );

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h2 className="page-title">Payment Records ({payments.length})</h2>
                <div className="payment-search-bar">
                    <FaSearch className="payment-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by customer, payment ID, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {payments.length === 0 && !loading ? (
                <div className="empty-state">
                    <div className="empty-icon">💳</div>
                    <h3>No Payments Found</h3>
                    <p>There are no payment records available.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-btn"
                    >
                        Refresh Page
                    </button>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="payment-table-container">
                        <table className="payment-table">
                            <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-results">
                                        No payments match your search
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map(payment => (
                                    <tr key={payment.id}>
                                        <td className="payment-id">{payment.paymentId}</td>
                                        <td>
                                            <div className="customer-info">
                                                <strong>{payment.name}</strong>
                                                <small>{payment.email}</small>
                                            </div>
                                        </td>
                                        <td className="amount">{formatAmount(payment.amount)}</td>
                                        <td>{renderStatus(payment.status)}</td>
                                        <td>{payment.date}</td>
                                        <td style={{display: "flex", gap: "0.5rem"}}>
                                            <button
                                                onClick={() => handleViewClick(payment)}
                                                className="payment-view-btn"
                                            >
                                                <FaEye /> View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(payment)}
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
                        {filteredPayments.length === 0 ? (
                            <div className="no-results">No payments match your search</div>
                        ) : (
                            filteredPayments.map(payment => (
                                <div key={payment.id} className="payment-card">
                                    <div className="card-header">
                                        <div className="payment-id">{payment.paymentId}</div>
                                        {renderStatus(payment.status)}
                                    </div>
                                    <div className="card-details">
                                        <div className="detail-row">
                                            <span>Customer:</span>
                                            <span>{payment.name}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Email:</span>
                                            <span>{payment.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Amount:</span>
                                            <span className="amount">{formatAmount(payment.amount)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Date:</span>
                                            <span>{payment.date}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Method:</span>
                                            <span className="payment-method">
                                                {renderMethodIcon(payment.method)} {payment.method}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mobile-actions">
                                        <button
                                            onClick={() => handleViewClick(payment)}
                                            className="payment-view-btn mobile"
                                        >
                                            <FaEye /> View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(payment)}
                                            className="payment-delete-btn mobile"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* View Payment Details Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={`Payment Details - ${selectedPayment?.paymentId}`}
                size="large"
            >
                {selectedPayment ? (
                    <div className="payment-details-modal">
                        <div className="details-section">
                            <h3>Customer Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <strong>Name:</strong> {selectedPayment.name}
                                </div>
                                <div className="info-item">
                                    <strong>Email:</strong> {selectedPayment.email}
                                </div>
                                <div className="info-item">
                                    <strong>Payment Date:</strong> {selectedPayment.fullDate}
                                </div>
                                <div className="info-item">
                                    <strong>Razorpay Order ID:</strong> {selectedPayment.razorpayOrderId || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="details-section">
                            <h3>Payment Summary</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <strong>Amount:</strong> {formatAmount(selectedPayment.amount)}
                                </div>
                                <div className="info-item" style={{display:"flex",alignItems:"center",gap:"0.2rem"}}>
                                    <strong>Status:</strong> {renderStatus(selectedPayment.status)}
                                </div>
                                <div className="info-item">
                                    <strong>Payment Method:</strong> {selectedPayment.method}
                                </div>
                                <div className="info-item">
                                    <strong>Payment ID:</strong> {selectedPayment.paymentId}
                                </div>
                            </div>
                        </div>

                        {selectedPayment.items && selectedPayment.items.length > 0 && (
                            <div className="details-section">
                                <h3>Order Items</h3>
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
                                    {selectedPayment.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.product?.name || "Product"}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatAmount(item.price)}</td>
                                            <td>{formatAmount(item.quantity * item.price)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No payment selected</p>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
                size="small"
            >
                <p>Are you sure you want to delete the payment record for <strong>{selectedPayment?.name}</strong>?</p>
                {selectedPayment && (
                    <div className="delete-info">
                        <p><strong>Payment ID:</strong> {selectedPayment.paymentId}</p>
                        <p><strong>Amount:</strong> {formatAmount(selectedPayment.amount)}</p>
                    </div>
                )}
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

export default Payment;