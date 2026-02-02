import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { DEMO_MODE } from '../config/appConfig';
import PageWrapper from '../components/common/PageWrapper';
import SecondaryButton from '../components/common/SecondaryButton';
import styles from './Checkout.module.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartTotal } = useCart();
    const [status, setStatus] = useState('scan'); // 'scan' | 'processing'

    // Simulated step progression
    useEffect(() => {
        // If DEMO_MODE, auto-proceed simulation
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setStatus('processing');
                // Processing Step
                setTimeout(() => {
                    navigate('/receipt');
                }, 2500);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [navigate]);

    return (
        <PageWrapper showHeader={true}>
            <div className={styles.container}>
                <div className={styles.stepIndicator}>Step 3 of 3</div>

                {DEMO_MODE && (
                    <div className={styles.demoBadge}>
                        TEST MODE
                    </div>
                )}

                {status === 'scan' ? (
                    <div className={styles.paymentBox}>
                        <h2 className={styles.title}>Select Payment Method</h2>
                        <p className={styles.total}>Total: ${cartTotal.toFixed(2)}</p>

                        <div className={styles.methods}>
                            <div className={styles.methodCard}>
                                <span className={styles.methodIcon}>📲</span>
                                {DEMO_MODE ? "Simulating App Payment..." : "Scan QR"}
                            </div>
                            <div className={styles.methodCard}>
                                <span className={styles.methodIcon}>💳</span>
                                Insert Card
                            </div>
                        </div>

                        <SecondaryButton className={styles.cancelBtn} onClick={() => navigate('/cart')}>
                            Cancel & Go Back
                        </SecondaryButton>
                    </div>
                ) : (
                    <div className={styles.processing}>
                        <div className={styles.spinner} />
                        <h2 className={styles.procTitle}>Simulating Payment...</h2>
                        <p className={styles.procSub}>Please wait while we connect to bank</p>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Checkout;
