import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useSession } from '../context/SessionContext';
import PageWrapper from '../components/common/PageWrapper';
import PrimaryButton from '../components/common/PrimaryButton';
import SecondaryButton from '../components/common/SecondaryButton';
import styles from './CameraScan.module.css';

const STAGES = {
    FRONT: 'front',
    LEFT: 'left',
    RIGHT: 'right',
    REVIEW: 'review'
};

const CameraScan = () => {
    const navigate = useNavigate();
    const { saveStepImage, scannedImages } = useSession();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [currentStage, setCurrentStage] = useState(STAGES.FRONT);
    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPreviewImage(imageSrc);
    }, [webcamRef]);

    const detectSkinTone = (imageSrc) => {
        if (!imageSrc) return Promise.resolve(null);

        const detectionPromise = new Promise((resolve) => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                if (!canvasRef.current) {
                    console.error("Canvas ref is null");
                    resolve(null);
                    return;
                }
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                // Analyze a smaller central area to focus on face (40% width/height)
                const centerX = img.width * 0.3;
                const centerY = img.height * 0.25;
                const width = img.width * 0.4;
                const height = img.height * 0.4;

                const imageData = ctx.getImageData(centerX, centerY, width, height);
                const data = imageData.data;

                let totalBrightness = 0;
                let skinPixelCount = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Convert to YCbCr for better skin detection
                    // Y = 0.299R + 0.587G + 0.114B
                    // Cb = 128 - 0.168736R - 0.331264G + 0.5B
                    // Cr = 128 + 0.5R - 0.418688G - 0.081312B

                    const Y = 0.299 * r + 0.587 * g + 0.114 * b;
                    const Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
                    const Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

                    // Skin color range in YCbCr
                    // Cb: [77, 127], Cr: [133, 173] is a common range for skin
                    if (Cb >= 77 && Cb <= 127 && Cr >= 133 && Cr <= 173) {
                        totalBrightness += Y; // Use Y (Luma) as brightness
                        skinPixelCount++;
                    }
                }

                // If no skin pixels detected, fallback to average of center
                let finalBrightness = 0;
                if (skinPixelCount > 0) {
                    finalBrightness = totalBrightness / skinPixelCount;
                } else {
                    // Fallback to simple average logic if filter fails
                    let r = 0, g = 0, b = 0;
                    for (let i = 0; i < data.length; i += 4) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                    }
                    finalBrightness = (r + g + b) / (data.length / 4 * 3); // Average RGB
                }

                if (finalBrightness < 50 || finalBrightness > 250) {
                    alert("Lighting conditions are not optimal. Please adjust lighting if possible.");
                }

                // Adjusted thresholds for skin tone based on Luma (Y)
                let tone;
                if (finalBrightness > 150) tone = "Very Fair";
                else if (finalBrightness > 135) tone = "Fair";
                else if (finalBrightness > 115) tone = "Wheatish";
                else if (finalBrightness > 90) tone = "Brown";
                else tone = "Dark";

                resolve(tone);
            };
            img.onerror = () => {
                resolve(null);
            };
        });

        // Race against a timeout
        const timeoutPromise = new Promise(resolve => setTimeout(() => {
            resolve(null);
        }, 2000)); // 2 second timeout

        return Promise.race([detectionPromise, timeoutPromise]);
    };

    const handleContinue = async () => {
        // ALWAYS save the image first so we don't lose it
        saveStepImage(currentStage, previewImage);

        if (currentStage === STAGES.FRONT) {
            try {
                // Determine if we need to wait or if we can process in background
                // For now, let's wait but with a strict timeout so we don't block forever
                const tone = await detectSkinTone(previewImage);

                if (tone) {
                    saveStepImage("skinTone", tone);
                }
            } catch (e) {
                console.error("Error during skin tone detection:", e);
            }
        }

        // Move to the next stage regardless of detection outcome

        // Move to the next stage
        setPreviewImage(null);
        if (currentStage === STAGES.FRONT) {
            setCurrentStage(STAGES.LEFT);
        } else if (currentStage === STAGES.LEFT) {
            setCurrentStage(STAGES.RIGHT);
        } else if (currentStage === STAGES.RIGHT) {
            setCurrentStage(STAGES.REVIEW);
        }
    };

    const handleRetake = () => {
        setPreviewImage(null);
    };

    const sendImagesToBackend = async () => {
        setIsSubmitting(true);
        try {
            // Mocking the backend call
            const payload = {
                front: scannedImages.front ? "present" : "missing",
                left: scannedImages.left ? "present" : "missing",
                right: scannedImages.right ? "present" : "missing",
                skinTone: scannedImages.skinTone
            };
            console.log("Sending images to backend:", payload);

            // In a real scenario, we would use fetch or axios here:
            /*
            await fetch('/api/analyze', {
                method: 'POST',
                body: JSON.stringify({
                    front: scannedImages.front,
                    left: scannedImages.left,
                    right: scannedImages.right,
                    skinTone: scannedImages.skinTone
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            */

            // Artificial delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            navigate('/processing');
        } catch (error) {
            console.error("Failed to send images:", error);
            alert("Failed to submit images. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStageTitle = () => {
        switch (currentStage) {
            case STAGES.FRONT: return "Front Profile";
            case STAGES.LEFT: return "Left Profile";
            case STAGES.RIGHT: return "Right Profile";
            case STAGES.REVIEW: return "Review Captures";
            default: return "";
        }
    };

    const renderWebcam = () => (
        <div className={styles.webcamContainer}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className={styles.webcamFeed}
                videoConstraints={{ facingMode: "user" }}
            />
            <div className={styles.overlay}>
                <div className={styles.guideFrame}>
                    {currentStage === STAGES.FRONT && <div className={styles.frontGuide} />}
                    {currentStage === STAGES.LEFT && <div className={styles.sideGuideLeft} />}
                    {currentStage === STAGES.RIGHT && <div className={styles.sideGuideRight} />}
                </div>
            </div>
            <button className={styles.captureBtn} onClick={capture}>
                <div className={styles.captureInner} />
            </button>
        </div>
    );

    const renderPreview = () => (
        <div className={styles.previewContainer}>
            <img src={previewImage} alt="Captured" className={styles.previewImage} />
            <div className={styles.previewControls}>
                <SecondaryButton onClick={handleRetake} className={styles.retakeBtn}>
                    Retake
                </SecondaryButton>
                <PrimaryButton onClick={handleContinue} className={styles.continueBtn}>
                    Continue
                </PrimaryButton>
            </div>
        </div>
    );

    const renderReviewGrid = () => {
        const allCaptured = scannedImages.front && scannedImages.left && scannedImages.right;

        return (
            <div className={styles.reviewGridContainer}>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <h4>Front</h4>
                        <img src={scannedImages.front} alt="Front" />
                        <button onClick={() => { setCurrentStage(STAGES.FRONT); setPreviewImage(null); }}>Retake</button>
                    </div>
                    <div className={styles.reviewItem}>
                        <h4>Left</h4>
                        <img src={scannedImages.left} alt="Left" />
                        <button onClick={() => { setCurrentStage(STAGES.LEFT); setPreviewImage(null); }}>Retake</button>
                    </div>
                    <div className={styles.reviewItem}>
                        <h4>Right</h4>
                        <img src={scannedImages.right} alt="Right" />
                        <button onClick={() => { setCurrentStage(STAGES.RIGHT); setPreviewImage(null); }}>Retake</button>
                    </div>
                </div>

                {allCaptured && (
                    <div className={styles.finalAction}>
                        <PrimaryButton
                            onClick={sendImagesToBackend}
                            disabled={isSubmitting}
                            className={styles.analysisBtn}
                        >
                            {isSubmitting ? "Submitting..." : "Continue to Analysis"}
                        </PrimaryButton>
                    </div>
                )}
            </div>
        );
    };

    return (
        <PageWrapper showHeader={true} title="AI Body Scan">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{renderStageTitle()}</h2>
                    <p className={styles.subtitle}>
                        {currentStage !== STAGES.REVIEW ? "Position yourself within the guide and capture your photo." : "Please review your profile photos before proceeding."}
                    </p>
                </div>

                <div className={styles.content}>
                    {currentStage === STAGES.REVIEW ? (
                        renderReviewGrid()
                    ) : (
                        previewImage ? renderPreview() : renderWebcam()
                    )}
                </div>

                {currentStage !== STAGES.REVIEW && (
                    <div className={styles.stepIndicator}>
                        <div className={`${styles.dot} ${currentStage === STAGES.FRONT ? styles.activeDot : ''} ${scannedImages.front ? styles.doneDot : ''}`} />
                        <div className={`${styles.dot} ${currentStage === STAGES.LEFT ? styles.activeDot : ''} ${scannedImages.left ? styles.doneDot : ''}`} />
                        <div className={`${styles.dot} ${currentStage === STAGES.RIGHT ? styles.activeDot : ''} ${scannedImages.right ? styles.doneDot : ''}`} />
                    </div>
                )}

                {/* Hidden canvas for image processing - kept outside conditional rendering */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </PageWrapper>
    );
};

export default CameraScan;
