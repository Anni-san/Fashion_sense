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

                {/* Constrained Container for Video & Overlays */}
                <div className={styles.videoContainer}>
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
                                {/* Internal button logic moved to main controls, this is just info now or redundant CTA */}
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

                    {/* Interactive Overlays (Only visible when active/loading) */}
                    {cameraState !== 'denied' && cameraState !== 'error' && (
                        <>
                            <div className={styles.silhouette}>
                                {/* Realistic Upper Body Guide SVG */}
                                <svg viewBox="0 0 200 300" className={styles.silhouetteSvg} preserveAspectRatio="xMidYMid meet">
                                    {/* Head */}
                                    <path d="M100,20 C125,20 140,45 140,75 C140,115 125,130 100,130 C75,130 60,115 60,75 C60,45 75,20 100,20"
                                        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="6 4" />
                                    {/* Shoulders & Torso */}
                                    <path d="M140,120 Q160,125 180,140 Q190,150 190,300"
                                        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="6 4" />
                                    <path d="M60,120 Q40,125 20,140 Q10,150 10,300"
                                        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="6 4" />
                                    {/* Center Line (Subtle) */}
                                    <line x1="100" y1="20" x2="100" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                </svg>

                                <div className={styles.scanLine} />
                            </div>

                            <div className={styles.statusIndicator}>
                                <span className={`${styles.statusDot} ${cameraState === 'active' ? styles.statusActive : ''}`}></span>
                                {cameraState === 'active' ? 'Camera Active' : 'Connecting...'}
                            </div>

                            {cameraState === 'active' && (
                                <div className={styles.instructionsContainer}>
                                    <p className={styles.instructionsTitle}>Align head & shoulders within the guide</p>
                                </div>
                            )}
                        </>
                    )}

                    {countdown !== null && (
                        <div className={styles.countdownOverlay}>
                            <span className={styles.countdownNumber}>{countdown > 0 ? countdown : 'Hold Still!'}</span>
                        </div>
                    )}

                    {/* Controls - Inside the video container for overlay look */}
                    <div className={styles.controlsOverlay}>
                        <div className={styles.controlsGrid}>
                            {/* Empty left slot for balance if needed, or switch button here? 
                                User said "bottom-right" for switch in previous turn, but "allign instraight line" now.
                                Let's keep Switch right, Capture center. 
                            */}

                            <div /> {/* Spacer Left */}

                            {cameraState === 'active' && countdown === null && (
                                <button className={styles.captureBtn} onClick={startScanBlock}>
                                    <div className={styles.captureInner} />
                                    <span className={styles.captureLabel}>Start scan</span>
                                </button>
                            )}

                            <SecondaryButton
                                className={styles.switchBtn}
                                onClick={() => navigate('/manual-input')}
                            >
                                Switch to Manual Input
                            </SecondaryButton>
                        </div>
                    </div>

                </div> {/* End of videoContainer */}
            </div> {/* End of container */}
        </PageWrapper >
    );
};

export default CameraScan;
