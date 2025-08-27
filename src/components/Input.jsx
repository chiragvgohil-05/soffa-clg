import React from 'react';
import '../styles/Input.css';
import {isDisabled} from "@testing-library/user-event/dist/utils";

const Input = ({
                   label,
                   type = "text",
                   placeholder,
                   value,
                   onChange,
                   className = "",
                   error,
                   required = false,
                   name,
                   labelClassName = "", // ✅ added
                   disabled,
                   ...props
               }) => {
    return (
        <div className="input-group">
            {label && (
                <label className={`input-label ${labelClassName}`} htmlFor={name}>
                    {label}
                    {required && <span className="required-star">*</span>}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`input ${className} ${error ? 'input-error' : ''}`}
                {...props}
                disabled={disabled}
            />

            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;
