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
        navigate(mode === 'manual' ? '/manual-input' : '/camera-scan');
    };

    return (
        <PageWrapper>
            <div className={styles.container}>
                <h2 className={styles.heading}>How would you like to continue?</h2>

                <div className={styles.cardsContainer}>
                    <div className={styles.card} onClick={() => handleSelection('manual')}>
                        <div className={styles.icon}>📏</div>
                        <h3 className={styles.cardTitle}>Enter Measurements</h3>
                        <p className={styles.cardSubtitle}>Quick and private</p>
                    </div>

                    <div className={styles.card} onClick={() => handleSelection('camera')}>
                        <div className={styles.icon}>📷</div>
                        <h3 className={styles.cardTitle}>Scan with Camera</h3>
                        <p className={styles.cardSubtitle}>More accurate fit</p>
                    </div>
                </div>

                <p className={styles.footerText}>Images are not stored. Used only for fitting analysis.</p>
            </div>
        </PageWrapper>
    );
};

export default InputMethod;
