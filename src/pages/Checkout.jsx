import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { DEMO_MODE } from '../config/appConfig';
import PageWrapper from '../components/common/PageWrapper';
import styles from './Checkout.module.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartTotal } = useCart();
    const [status, setStatus] = useState('scan'); // 'scan' | 'processing'

    useEffect(() => {
        // If DEMO_MODE, auto-proceed
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setStatus('processing');
                setTimeout(() => {
                    navigate('/receipt');
                }, 2000); // 2s processing simulation
            }, 1000); // 1s initial delay

            return () => clearTimeout(timer);
        }
    }, [navigate]);

    return (
        <PageWrapper showHeader={true}>
            <div className={styles.container}>
                {status === 'scan' ? (
                    <div className={styles.paymentBox}>
                        <h2>Select Payment Method</h2>
                        <p className={styles.total}>Total: ${cartTotal.toFixed(2)}</p>

                        <div className={styles.methods}>
                            <div className={styles.methodCard}>Scanning QR...</div>
                            <div className={styles.methodCard}>Insert Card</div>
                        </div>
                        {DEMO_MODE && <p className={styles.demoText}>Simulating Payment...</p>}
                    </div>
                ) : (
                    <div className={styles.processing}>
                        <div className={styles.spinner} />
                        <h2>Processing Payment...</h2>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Checkout;
