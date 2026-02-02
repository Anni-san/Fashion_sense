import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PageWrapper from '../components/common/PageWrapper';
import PrimaryButton from '../components/common/PrimaryButton';
import SecondaryButton from '../components/common/SecondaryButton';
import styles from './Cart.module.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <PageWrapper showHeader={true}>
                <div className={styles.emptyContainer}>
                    <h2>Your cart is empty</h2>
                    <SecondaryButton onClick={() => navigate('/recommendations')} style={{ marginTop: 24, maxWidth: 200 }}>
                        Browse Items
                    </SecondaryButton>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.container}>
                <h2 className={styles.title}>Your Cart ({cartItems.length})</h2>

                <div className={styles.content}>
                    <div className={styles.itemsList}>
                        {cartItems.map(item => (
                            <div key={item.cartId} className={styles.itemRow}>
                                <div className={styles.itemImageWrapper}>
                                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                                </div>
                                <div className={styles.itemInfo}>
                                    <h3>{item.name}</h3>
                                    <p className={styles.size}>Size: {item.size}</p>
                                    <p className={styles.price}>${item.price.toFixed(2)}</p>
                                </div>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeFromCart(item.cartId)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summary}>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <PrimaryButton onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Cart;
