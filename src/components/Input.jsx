// src/components/Input.jsx
import React from 'react';
import '../styles/Input.css';

const Input = ({ type = "text", placeholder, value, onChange, className = "", ...props }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`input ${className}`}
            {...props}
        />
    );
};

export default Input;
