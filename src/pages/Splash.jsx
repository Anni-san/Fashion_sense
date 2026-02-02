import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import styles from './Splash.module.css';

const Splash = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 3000; // 3 seconds
        const intervalTime = 50;
        const steps = duration / intervalTime;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + (100 / steps);
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => navigate('/input-selection'), 200);
                    return 100;
                }
                return next;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <PageWrapper showHeader={false} className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.logo}>FashionSense</h1>
                <p className={styles.tagline}>Try smart. Shop faster.</p>

                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default Splash;
