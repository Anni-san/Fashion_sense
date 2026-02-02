import React from 'react';
import styles from './Buttons.module.css';

const SecondaryButton = ({ children, onClick, disabled, className = '', ...props }) => {
    return (
        <button
            className={`${styles.secondary} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
