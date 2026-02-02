import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import styles from './Processing.module.css';

const Processing = () => {
    const navigate = useNavigate();
    const [textIndex, setTextIndex] = useState(0);
    const messages = [
        "Analyzing body type...",
        "Matching ideal fits...",
        "Finding best styles..."
    ];

    useEffect(() => {
        // Navigate after all messages shown (approx 2s per message = 6s total)
        // Shortened for demo feel to 4.5s
        const totalDuration = 4500;

        // Rotate text
        const textInterval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % messages.length);
        }, 1500);

        const navTimeout = setTimeout(() => {
            navigate('/recommendations');
        }, totalDuration);

        return () => {
            clearInterval(textInterval);
            clearTimeout(navTimeout);
        };
    }, [navigate]);

    return (
        <PageWrapper showHeader={false}>
            <div className={styles.container}>
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner} />
                </div>
                <h2 className={styles.statusText} key={textIndex}>
                    {messages[textIndex]}
                </h2>
            </div>
        </PageWrapper>
    );
};

export default Processing;
