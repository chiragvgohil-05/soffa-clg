import React, { useState } from 'react';
import '../styles/Auth.css';
import { NavLink } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateEmail()) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                console.log('Password reset requested for:', email);
                setIsLoading(false);
                setIsSubmitted(true);
            }, 1500);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Forgot Password</h2>
                    <p className="auth-subtitle">
                        {isSubmitted
                            ? "Check your email for reset instructions"
                            : "Enter your email to reset your password"}
                    </p>
                </div>

                {!isSubmitted ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleInputChange}
                                className={`form-input ${error ? 'form-input-error' : ''}`}
                                placeholder="Enter your email"
                            />
                            {error && <span className="error-message">{error}</span>}
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <p>We've sent password reset instructions to your email.</p>
                        <p>Didn't receive the email? Check your spam folder or
                            <button
                                type="button"
                                className="resend-btn"
                                onClick={handleSubmit}
                            >
                                resend
                            </button>
                        </p>
                    </div>
                )}

                <div className="auth-switch">
                    <NavLink to="/login" className="switch-btn">
                        Back to Login
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;