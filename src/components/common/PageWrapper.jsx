import React, { useEffect } from 'react';
import { useInactivityTimer } from '../../hooks/useInactivityTimer';
import styles from './PageWrapper.module.css';

const PageWrapper = ({
    children,
    showHeader = true,
    showFooter = false,
    className = ''
}) => {
    // Activate Inactivity Timer
    useInactivityTimer();

    // Enforce Kiosk Rules (Disable Right Click)
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };
        window.addEventListener('contextmenu', handleContextMenu);
        return () => window.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    return (
        <div className={styles.wrapper}>
            {/* Optional Header Area - could be a component */}
            {showHeader && (
                <header className={styles.header}>
                    <div className={styles.logo}>FashionSense</div>
                </header>
            )}

            <main className={`${styles.main} ${className}`}>
                <div className={styles.contentContainer}>
                    {children}
                </div>
            </main>

            {/* Optional Footer Area */}
            {showFooter && (
                <footer className={styles.footer}>
                    <p>Explore the future of fashion</p>
                </footer>
            )}
        </div>
    );
};

export default PageWrapper;
