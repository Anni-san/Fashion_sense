import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import PageWrapper from '../components/common/PageWrapper';
import styles from './InputMethod.module.css';

const InputMethod = () => {
    const navigate = useNavigate();
    const { startSession } = useSession();

    const handleSelection = (mode) => {
        startSession(mode);
        // Add small delay for ripple/press effect visibility if needed
        setTimeout(() => {
            navigate(mode === 'manual' ? '/manual-input' : '/camera-scan');
        }, 150);
    };

    return (
        <PageWrapper>
            <div className={styles.container}>
                <h2 className={styles.heading}>How would you like to continue?</h2>
                <p className={styles.subHeading}>Tap a card to continue</p>

                <div className={styles.cardsContainer}>
                    <div className={styles.card} onClick={() => handleSelection('manual')} role="button" tabIndex={0}>
                        <div className={styles.icon}>📏</div>
                        <h3 className={styles.cardTitle}>Enter Measurements</h3>
                        <p className={styles.cardSubtitle}>Quick and private</p>
                    </div>

                    <div className={styles.card} onClick={() => handleSelection('camera')} role="button" tabIndex={0}>
                        <div className={styles.icon}>📷</div>
                        <h3 className={styles.cardTitle}>Scan with Camera</h3>
                        <p className={styles.cardSubtitle}>More accurate fit</p>
                        <div className={styles.privacyBadge}>
                            <span className={styles.shieldIcon}>🛡️</span>
                            Images not stored
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default InputMethod;
