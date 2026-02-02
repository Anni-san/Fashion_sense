import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSession } from '../context/SessionContext';
import { DEMO_MODE } from '../config/appConfig';
import PageWrapper from '../components/common/PageWrapper';
import PrimaryButton from '../components/common/PrimaryButton';
import styles from './Receipt.module.css';

const Receipt = () => {
    const navigate = useNavigate();
    const { clearCart, cartItems } = useCart();
    const { resetSession } = useSession();

    // Generate a random Order ID
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const handleFinish = () => {
        clearCart();
        resetSession();
        navigate('/');
    };

    // We don't automatically clear on mount, waiting for user interaction or inactivity timeout.
    // But maybe we should clear cart *contents* from context but keep internal receipt data locally?
    // Current logic: We show receipt based on CartContext, but if we clearCart() immediately, the receipt will be empty if we used cartItems to render.
    // So we just display the success and clear ONLY when they click "Done" or timeout.

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.iconCircle}>✓</div>
                    <h2 className={styles.successText}>
                        {DEMO_MODE ? "Demo Payment Successful" : "Payment Successful"}
                    </h2>

                    <p className={styles.orderId}>Order ID: {orderId}</p>

                    <div className={styles.qrPlaceholder}>
                        {/* Simple QR CSS pattern or SVG */}
                        <svg width="200" height="200" viewBox="0 0 100 100">
                            <rect width="100" height="100" fill="white" />
                            <rect x="10" y="10" width="30" height="30" fill="black" />
                            <rect x="60" y="10" width="30" height="30" fill="black" />
                            <rect x="10" y="60" width="30" height="30" fill="black" />
                            <rect x="15" y="15" width="20" height="20" fill="white" />
                            <rect x="65" y="15" width="20" height="20" fill="white" />
                            <rect x="15" y="65" width="20" height="20" fill="white" />
                            <rect x="20" y="20" width="10" height="10" fill="black" />
                            <rect x="70" y="20" width="10" height="10" fill="black" />
                            <rect x="20" y="70" width="10" height="10" fill="black" />
                            <rect x="50" y="50" width="10" height="10" fill="black" />
                        </svg>
                    </div>

                    <p className={styles.instruction}>
                        Show this QR to the store assistant to collect your {cartItems.length} item(s).
                    </p>

                    <PrimaryButton onClick={handleFinish} style={{ marginTop: 48, maxWidth: 300 }}>
                        Done / New Customer
                    </PrimaryButton>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Receipt;
