import React, { useState } from 'react';
import '../styles/Auth.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useCart} from "../context/CartContext";

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { fetchCart } = useCart();
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const BASE_URL = 'http://localhost:3000/api';
    const navigate = useNavigate(); // ✅ hook for redirection
    const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const res = await axios.post(`${BASE_URL}/auth/login`, formData);
                toast.success(res.data.message || "Login successful!");

                if (res.data?.data?.token) {
                    localStorage.setItem("token", res.data?.data?.token);
                    localStorage.setItem("role", res.data?.data?.user.role);
                    localStorage.setItem("user", JSON.stringify(res.data?.data?.user));
                    onLogin();
                }
                fetchCart();

                if (res.data?.data?.user?.role === "Admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Login failed");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group password-field">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                            placeholder="Enter your password"
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <span className="checkbox-text">Remember me </span>
                        </label>
                    </div>

                    <button type="submit" className="submit-btn">
                        Sign In
                    </button>
                </form>

                <div className="auth-switch">
                    <p className="switch-text">
                        Don't have an account?{' '}
                        <NavLink to="/register" className="switch-btn">
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
