import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import styles from './CameraScan.module.css';

const CameraScan = () => {
    const navigate = useNavigate();

    const handleCapture = () => {
        // Simulate capture delay then navigate
        setTimeout(() => {
            navigate('/processing');
        }, 800);
    };

    return (
        <PageWrapper showHeader={false} className={styles.wrapper}>
            <div className={styles.cameraPreview}>
                {/* Mockup overlay */}
                <div className={styles.silhouette}>
                    <svg viewBox="0 0 100 200" className={styles.silhouetteSvg}>
                        <path d="M50,10 C60,10 65,20 65,25 C75,28 85,35 85,60 C85,90 70,110 70,140 C70,180 60,190 50,190 C40,190 30,180 30,140 C30,110 15,90 15,60 C15,35 25,28 35,25 C35,20 40,10 50,10"
                            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                </div>

                <div className={styles.instructions}>
                    Stand straight within the frame
                </div>

                <div className={styles.controls}>
                    <button className={styles.retakeBtn} onClick={() => navigate('/input-selection')}>Cancel</button>
                    <button className={styles.captureBtn} onClick={handleCapture}>
                        <div className={styles.captureInner} />
                    </button>
                    <div style={{ width: 80 }}></div> {/* Spacer for balance */}
                </div>
            </div>
        </PageWrapper>
    );
};

export default CameraScan;
