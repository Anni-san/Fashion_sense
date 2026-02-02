import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import styles from './Splash.module.css';

const Splash = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("Initializing kiosk...");

    useEffect(() => {
        const duration = 3000; // 3 seconds
        const intervalTime = 50;
        const steps = duration / intervalTime;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + (100 / steps);

                // Update text based on progress for realism
                if (next > 30 && next < 60) setLoadingText("Preparing fitting engine...");
                if (next >= 60 && next < 90) setLoadingText("Almost ready...");

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

                <div className={styles.brandingSection}>
                    <h1 className={styles.brandName}>FashionSense</h1>
                    <p className={styles.systemBadge}>In-store Smart Fitting System</p>
                    <p className={styles.tagline}>Try smart. Shop faster.</p>
                </div>

                <div className={styles.loaderSection}>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    </div>

                    <div className={styles.statusGroup}>
                        <span className={styles.percentage}>{Math.round(progress)}%</span>
                        <span className={styles.statusText}>{loadingText}</span>
                    </div>
                </div>

            </div>
        </PageWrapper>
    );
};

export default Splash;
