import React, { useState, useEffect } from 'react';
import apiClient from '../../apiClient'; // your configured Axios instance
import '../styles/Payment.css';
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaClock,
    FaCreditCard,
    FaPaypal,
    FaUniversity,
    FaSearch,
    FaTrash
} from 'react-icons/fa';
import Modal from '../../components/Modal';
import toast from "react-hot-toast"; // your reusable modal

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await apiClient.get("/cart/orders"); // your backend endpoint

                // Map orders to payment records for frontend
                const mappedPayments = res.data.data.orders.map(order => ({
                    id: order._id,
                    paymentId: order.razorpayPaymentId || "N/A",
                    name: order.user?.name || "Unknown",
                    email: order.user?.email || "N/A",
                    amount: order.totalAmount,
                    status: order.status,
                    date: new Date(order.createdAt).toLocaleDateString(),
                    method: order.items[0]?.product?.paymentMethod || "Razorpay",
                }));

                setPayments(mappedPayments);
            } catch (err) {
                console.error("Error fetching payments:", err);
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

    const handleConfirmDelete = async () => {
        if (!selectedPayment) return;
        try {
            await apiClient.delete(`/cart/orders/${selectedPayment.id}`);
            setPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
            toast.success("Payment record deleted successfully");
        } catch (err) {
            console.error("Error deleting payment:", err);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedPayment(null);
        }
    };

    const filteredPayments = payments.filter(payment =>
        payment.name.toLowerCase().includes(search.toLowerCase()) ||
        payment.id.toLowerCase().includes(search.toLowerCase())
    );

    const formatAmount = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

    const renderStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <span className="status completed"><FaCheckCircle /> Completed</span>;
            case 'pending':
                return <span className="status pending"><FaClock /> Pending</span>;
            case 'failed':
                return <span className="status failed"><FaExclamationCircle /> Failed</span>;
            default:
                return <span className="status">{status}</span>;
        }
    };

    const renderMethodIcon = (method) => {
        switch (method.toLowerCase()) {
            case 'credit card': return <FaCreditCard className="method-icon" />;
            case 'paypal': return <FaPaypal className="method-icon" />;
            case 'bank transfer': return <FaUniversity className="method-icon" />;
            default: return null;
        }
    };

    if (loading) return <div className="payment-container">Loading payments...</div>;

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h2 className="page-title">Payment Records</h2>
                <div className="payment-search-bar">
                    <FaSearch className="payment-search-icon" />
                    <input
                        type="text"
                        placeholder="Search payments..."
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
                        <th>Payment ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPayments.length === 0 ? (
                        <tr><td colSpan="7" className="no-results">No payments found</td></tr>
                    ) : (
                        filteredPayments.map(payment => (
                            <tr key={payment.id}>
                                <td>{payment.paymentId}</td>
                                <td>{payment.name}</td>
                                <td className="amount">{formatAmount(payment.amount)}</td>
                                <td>{renderStatus(payment.status)}</td>
                                <td>{payment.date}</td>
                                <td>
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
                    <div className="no-results">No payments found</div>
                ) : (
                    filteredPayments.map(payment => (
                        <div key={payment.id} className="payment-card">
                            <div className="card-header">
                                <div className="payment-id">{payment.paymentId}</div>
                                {renderStatus(payment.status)}
                            </div>
                            <div className="card-details">
                                <div className="detail-row"><span>Customer:</span><span>{payment.name}</span></div>
                                <div className="detail-row"><span>Amount:</span><span className="amount">{formatAmount(payment.amount)}</span></div>
                                <div className="detail-row"><span>Date:</span><span>{payment.date}</span></div>
                                <div className="detail-row"><span>Method:</span><span className="payment-method">{renderMethodIcon(payment.method)} {payment.method}</span></div>
                            </div>
                            <button
                                onClick={() => handleDeleteClick(payment)}
                                className="payment-delete-btn mobile"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
                size="small"
            >
                <p>Are you sure you want to delete <strong>{selectedPayment?.name}</strong>'s order?</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        style={{
                            backgroundColor: '#e5e7eb',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Payment;
