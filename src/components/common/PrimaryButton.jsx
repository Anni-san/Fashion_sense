import React from 'react';
import styles from './Buttons.module.css';

const PrimaryButton = ({ children, onClick, disabled, className = '', ...props }) => {
    return (
        <button
            className={`${styles.primary} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
