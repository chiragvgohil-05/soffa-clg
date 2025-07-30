// src/components/Select.jsx
import React from 'react';
import '../styles/Select.css';

const Select = ({
                    label,
                    options = [],
                    value,
                    onChange,
                    placeholder = "Select",
                    className = "",
                    error,
                    required = false,
                    name,
                    labelClassName = "",
                    ...props
                }) => {
    return (
        <div className="select-group">
            {label && (
                <label className={`select-label ${labelClassName}`} htmlFor={name}>
                    {label}
                    {required && <span className="required-star">*</span>}
                </label>
            )}

            <div className={`select-container ${error ? 'select-error' : ''}`}>
                <select
                    id={name}
                    name={name}
                    className={`select ${className}`}
                    value={value}
                    onChange={onChange}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option, index) => {
                        const val = typeof option === 'object' ? option.value : option;
                        const label = typeof option === 'object' ? option.label : option;
                        return (
                            <option key={index} value={val}>{label}</option>
                        );
                    })}
                </select>

                <svg className="dropdown-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
            </div>

            {error && <span className="select-error-message">{error}</span>}
        </div>
    );
};

export default Select;
