import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSession } from '../context/SessionContext';
import pageWrapperStyles from '../components/common/PageWrapper.module.css'; // For header reset
import PageWrapper from '../components/common/PageWrapper';
import PrimaryButton from '../components/common/PrimaryButton';
import styles from './Receipt.module.css';

const Receipt = () => {
    const navigate = useNavigate();
    const { clearCart, cartItems, cartTotal } = useCart();
    const { resetSession } = useSession();
    const [countDown, setCountDown] = useState(15);

    // Generate a random Order ID just once
    const [orderInfo] = useState({
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleString(),
        storeId: "STORE-042"
    });

    const handleFinish = () => {
        clearCart();
        resetSession();
        navigate('/');
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountDown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.successHeader}>
                        <div className={styles.iconCircle}>✓</div>
                        <h2>Payment Successful</h2>
                    </div>

                    <div className={styles.qrSection}>
                        <div className={styles.qrPlaceholder}>
                            <svg viewBox="0 0 100 100" className={styles.qrSvg}>
                                <path d="M0,0 h100 v100 h-100 z" fill="white" />
                                <g fill="black">
                                    <rect x="10" y="10" width="25" height="25" />
                                    <rect x="65" y="10" width="25" height="25" />
                                    <rect x="10" y="65" width="25" height="25" />
                                    <rect x="15" y="15" width="15" height="15" fill="white" />
                                    <rect x="70" y="15" width="15" height="15" fill="white" />
                                    <rect x="15" y="70" width="15" height="15" fill="white" />
                                    <rect x="19" y="19" width="7" height="7" />
                                    <rect x="74" y="19" width="7" height="7" />
                                    <rect x="19" y="74" width="7" height="7" />
                                    <rect x="45" y="45" width="10" height="10" />
                                    <rect x="55" y="15" width="5" height="5" />
                                    <rect x="15" y="55" width="5" height="5" />
                                    {/* Mock noise */}
                                    <rect x="40" y="10" width="10" height="10" />
                                    <rect x="80" y="40" width="10" height="10" />
                                </g>
                            </svg>
                        </div>
                        <p className={styles.scanText}>Show to assistant</p>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.row}>
                            <span>Order ID</span>
                            <span className={styles.mono}>{orderInfo.id}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Date</span>
                            <span>{orderInfo.timestamp}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Items</span>
                            <span>{cartItems.length}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Total</span>
                            <span className={styles.totalPrice}>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <PrimaryButton onClick={handleFinish} className={styles.doneBtn}>
                            Done ({countDown}s)
                        </PrimaryButton>
                        <p className={styles.resetNote}>Session will close automatically</p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Receipt;
