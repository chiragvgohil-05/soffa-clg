import React, { useState } from 'react';
import '../styles/Payment.css';
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaClock,
    FaCreditCard,
    FaPaypal,
    FaUniversity,
    FaSearch
} from 'react-icons/fa';

const payments = [
    { id: 'PMT001', name: 'John Doe', amount: 5000, status: 'Completed', date: '2025-08-06', method: 'Credit Card' },
    { id: 'PMT002', name: 'Jane Smith', amount: 7500, status: 'Pending', date: '2025-08-05', method: 'PayPal' },
    { id: 'PMT003', name: 'Bob Johnson', amount: 3000, status: 'Failed', date: '2025-08-04', method: 'Bank Transfer' }
];

const Payment = () => {
    const [search, setSearch] = useState('');

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
                        <th>Method</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPayments.length === 0 ? (
                        <tr><td colSpan="6" className="no-results">No payments found</td></tr>
                    ) : (
                        filteredPayments.map(payment => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.name}</td>
                                <td className="amount">{formatAmount(payment.amount)}</td>
                                <td>{renderStatus(payment.status)}</td>
                                <td>{payment.date}</td>
                                <td className="payment-method">
                                    {renderMethodIcon(payment.method)}<span>{payment.method}</span>
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
                                <div className="payment-id">{payment.id}</div>
                                {renderStatus(payment.status)}
                            </div>
                            <div className="card-details">
                                <div className="detail-row"><span>Customer:</span><span>{payment.name}</span></div>
                                <div className="detail-row"><span>Amount:</span><span className="amount">{formatAmount(payment.amount)}</span></div>
                                <div className="detail-row"><span>Date:</span><span>{payment.date}</span></div>
                                <div className="detail-row"><span>Method:</span><span className="payment-method">{renderMethodIcon(payment.method)} {payment.method}</span></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Payment;
