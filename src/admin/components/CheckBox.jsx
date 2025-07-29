import React from 'react';
import '../styles/CheckBox.css';

const CheckBox = ({
                      label,
                      name,
                      checked = false,
                      onChange,
                      required = false,
                      className = '',
                      labelClassName = '',
                      ...props
                  }) => {
    return (
        <div className={`checkbox-wrapper ${className}`}>
            <label className={`checkbox-label ${labelClassName}`}>
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="checkbox-input"
                    {...props}
                />
                <span className="checkbox-custom" />
                {label && (
                    <span className="checkbox-text">
                        {label} {required && <span className="required-star">*</span>}
                    </span>
                )}
            </label>
        </div>
    );
};

export default CheckBox;
