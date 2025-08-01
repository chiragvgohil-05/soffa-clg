import React, { useState, useEffect } from 'react';
import '../styles/TextArea.css';

const TextArea = ({
                      label = '',
                      value = '',
                      onChange,
                      placeholder = '',
                      maxLength = null,
                      minLength = null,
                      required = false,
                      disabled = false,
                      readOnly = false,
                      rows = 4,
                      cols = null,
                      className = '',
                      errorMessage = '',
                      showCharCount = true,
                      validation = null,
                      onBlur = null,
                      onFocus = null,
                  }) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState(errorMessage);
    const [isValid, setIsValid] = useState(true);

    // Handle external value changes
    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    // Handle error message changes
    useEffect(() => {
        setError(errorMessage);
        setIsValid(!errorMessage);
    }, [errorMessage]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        // Validate input
        if (validation) {
            const validationResult = validation(newValue);
            if (typeof validationResult === 'string') {
                setError(validationResult);
                setIsValid(false);
            } else {
                setError('');
                setIsValid(true);
            }
        } else if (required && !newValue.trim()) {
            setError('This field is required');
            setIsValid(false);
        } else if (minLength && newValue.length < minLength) {
            setError(`Minimum ${minLength} characters required`);
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }

        if (onChange) {
            onChange(e);
        }
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) {
            onBlur(e);
        }

        // Validate on blur if not already validated
        if (!validation && required && !internalValue.trim()) {
            setError('This field is required');
            setIsValid(false);
        }
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) {
            onFocus(e);
        }
    };

    // Calculate remaining characters
    const remainingChars = maxLength ? maxLength - internalValue.length : null;

    return (
        <div className={`textarea-container ${className}`}>
            {label && <label className="textarea-label">{label}</label>}

            <textarea
                className={`textarea-field ${!isValid ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
                value={internalValue}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={rows}
                cols={cols}
                disabled={disabled}
                readOnly={readOnly}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />

            {(showCharCount || error) && (
                <div className="textarea-footer">
                    {error ? (
                        <div className="textarea-error">{error}</div>
                    ) : (
                        <div></div>
                        )}

                    {showCharCount && maxLength && (
                        <div className={`textarea-counter ${remainingChars < 10 ? 'error' : ''}`}>
                            {remainingChars} characters remaining
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TextArea;