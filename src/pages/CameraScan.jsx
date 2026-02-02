import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import SecondaryButton from '../components/common/SecondaryButton';
import styles from './CameraScan.module.css';

const CameraScan = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [cameraState, setCameraState] = useState('loading'); // 'loading' | 'active' | 'denied' | 'error'
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        let stream = null;

        const startCamera = async () => {
            try {
                setCameraState('loading');
                // Request camera
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraState('active');
                }
            } catch (err) {
                console.error("Camera access error:", err);
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setCameraState('denied');
                } else {
                    setCameraState('error');
                }
            }
        };

        startCamera();

        return () => {
            // Cleanup stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startScanBlock = () => {
        if (cameraState !== 'active') return;

        setCountdown(3);

        // Countdown logic
        let count = 3;
        const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === 0) {
                clearInterval(timer);
                // Simulate scan snap
                setTimeout(() => navigate('/processing'), 200);
            }
        }, 1000);
    };

    return (
        <PageWrapper showHeader={false} className={styles.wrapper}>
            <div className={styles.cameraPreview}>
                {/* Video Element for Real Camera */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`${styles.videoFeed} ${cameraState === 'active' ? styles.feedActive : ''}`}
                />

                {/* Fallback / Error UI */}
                {cameraState !== 'active' && cameraState !== 'loading' && (
                    <div className={styles.errorOverlay}>
                        <div className={styles.errorContent}>
                            <div className={styles.errorIcon}>📷</div>
                            <h3>{cameraState === 'denied' ? 'Camera Access Denied' : 'Camera Unavailable'}</h3>
                            <p>We couldn't access your camera. Please use manual input.</p>
                            <SecondaryButton onClick={() => navigate('/manual-input')} style={{ marginTop: 24 }}>
                                Switch to Manual Input
                            </SecondaryButton>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {cameraState === 'loading' && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                        <p> activating camera...</p>
                    </div>
                )}

                {/* Overlays (Only visible when active/loading to avoid cluttering error state) */}
                {cameraState !== 'denied' && cameraState !== 'error' && (
                    <>
                        <div className={styles.silhouette}>
                            <svg viewBox="0 0 100 200" className={styles.silhouetteSvg}>
                                <path d="M50,10 C60,10 65,20 65,25 C75,28 85,35 85,60 C85,90 70,110 70,140 C70,180 60,190 50,190 C40,190 30,180 30,140 C30,110 15,90 15,60 C15,35 25,28 35,25 C35,20 40,10 50,10"
                                    fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeDasharray="4 4" />
                            </svg>
                            <div className={styles.scanLine} />
                        </div>

                        <div className={styles.statusIndicator}>
                            <span className={`${styles.statusDot} ${cameraState === 'active' ? styles.statusActive : ''}`}></span>
                            {cameraState === 'active' ? 'Camera Active' : 'Connecting...'}
                        </div>
                    </>
                )}

                {countdown !== null ? (
                    <div className={styles.countdownOverlay}>
                        <span className={styles.countdownNumber}>{countdown > 0 ? countdown : 'Hold Still!'}</span>
                    </div>
                ) : (
                    <>
                        {/* Controls - Hide capture if error */}
                        <div className={styles.controls}>
                            <SecondaryButton
                                className={styles.switchBtn}
                                onClick={() => navigate('/manual-input')}
                            >
                                Switch to Manual Input
                            </SecondaryButton>

                            {cameraState === 'active' && (
                                <button className={styles.captureBtn} onClick={startScanBlock}>
                                    <div className={styles.captureInner} />
                                    <span className={styles.captureLabel}>Start Scan</span>
                                </button>
                            )}

                            <div style={{ width: 200 }} className={styles.spacer}></div>
                        </div>

                        {cameraState === 'active' && (
                            <div className={styles.instructionsContainer}>
                                <p className={styles.instructionsTitle}>Stand straight. Hold still for scan.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageWrapper>
    );
};

export default CameraScan;
