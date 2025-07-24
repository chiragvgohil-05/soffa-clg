import React from 'react';
import '../styles/SectionHeading.css';

const SectionHeading = ({ title, leftIcon, rightIcon, color = '#caa636' }) => {
    return (
        <div className="section-heading">
            {leftIcon && <img src={leftIcon} alt="left decoration" className="decor-icon" />}
            <h2 className="section-title" style={{ color }}>{title}</h2>
            {rightIcon && <img src={rightIcon} alt="right decoration" className="decor-icon" />}
        </div>
    );
};

export default SectionHeading;
