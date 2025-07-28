// src/components/Select.jsx
import React from 'react';
import '../styles/Select.css';

const Select = ({ options = [], value, onChange, placeholder = "Select", className = "", ...props }) => {
    return (
        <div className={`select-container ${className}`}>
            <select className="select" value={value} onChange={onChange} {...props}>
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            <svg className="dropdown-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
        </div>
    );
};

export default Select;
