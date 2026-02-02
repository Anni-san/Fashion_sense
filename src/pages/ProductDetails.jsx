import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PageWrapper from '../components/common/PageWrapper';
import PrimaryButton from '../components/common/PrimaryButton';
import SecondaryButton from '../components/common/SecondaryButton';
import { products } from '../data/products';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const product = products.find(p => p.id === parseInt(id));

    // Logic: Some sizes disabled for "realism"
    const availableSizes = ["S", "M", "L", "XL"];
    const disabledSizes = ["XS", "XXL"]; // Example disabled
    const recommendedSize = "M"; // Based on prompt context

    const [selectedSize, setSelectedSize] = useState(recommendedSize);
    const [showAddedToast, setShowAddedToast] = useState(false);

    if (!product) return <div>Product not found</div>;

    const handleAddToCart = () => {
        addToCart(product, selectedSize);
        setShowAddedToast(true);
        setTimeout(() => setShowAddedToast(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, selectedSize);
        navigate('/checkout');
    };

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.layout}>
                {/* Visible Back Button */}
                <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
                    <span className={styles.backIcon}>←</span> Back
                </button>

                <div className={styles.imageCol}>
                    <img src={product.image} alt={product.name} className={styles.image} />
                </div>

                <div className={styles.infoCol}>
                    <div className={styles.scrollableContent}>
                        <div className={styles.header}>
                            <div className={styles.matchBadge}>⭐ {product.fitScore}% Match</div>
                            <h1 className={styles.name}>{product.name}</h1>
                            <p className={styles.price}>${product.price.toFixed(2)}</p>
                        </div>

                        <div className={styles.section}>
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className={styles.section}>
                            <h3>Details</h3>
                            <div className={styles.detailRow}><span>Material</span><span>{product.material}</span></div>
                            <div className={styles.detailRow}><span>Fit</span><span>{product.fit}</span></div>
                            <div className={styles.iconsRow}><span>🧴 {product.care}</span></div>
                        </div>

                        <div className={styles.section}>
                            <h3>Select Size</h3>
                            <div className={styles.sizeGrid}>
                                {availableSizes.map(size => (
                                    <button
                                        key={size}
                                        className={`${styles.sizeBtn} ${selectedSize === size ? styles.selected : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                                {/* Render some disabled ones for demo */}
                                {['XXL'].map(size => (
                                    <button key={size} className={styles.sizeBtn} disabled>
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <p className={styles.sizeHint}>
                                Recommended for you: <strong>{recommendedSize}</strong>
                                <span className={styles.sizeReason}> (Best fit for your chest/waist)</span>
                            </p>
                        </div>

                        {/* --- NEW: Fit Confidence --- */}
                        <div className={styles.section}>
                            <h3>Fit Confidence</h3>
                            <div className={styles.confidenceCard}>
                                <div className={styles.confidenceRow}>
                                    <div className={styles.metricGroup}>
                                        <span className={styles.metricLabel}>Height</span>
                                        <span className={styles.metricValue}>98%</span>
                                    </div>
                                    <p className={styles.metricText}>Length complements your height perfectly.</p>
                                </div>
                                <div className={styles.confidenceSeparator} />
                                <div className={styles.confidenceRow}>
                                    <div className={styles.metricGroup}>
                                        <span className={styles.metricLabel}>Shoulders</span>
                                        <span className={styles.metricValue}>96%</span>
                                    </div>
                                    <p className={styles.metricText}>Designed to sit comfortably at your shoulder line.</p>
                                </div>
                                <div className={styles.confidenceSeparator} />
                                <div className={styles.confidenceTotal}>
                                    <span className={styles.totalLabel}>Overall Confidence</span>
                                    <p className={styles.totalText}>
                                        Excellent match. accurate to your fit profile.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- NEW: In-store Benefits --- */}
                        <div className={styles.benefitSection}>
                            <h3>In-store Benefits</h3>
                            <div className={styles.benefitList}>
                                <div className={styles.benefitItem}>• First purchase discount applied</div>
                                <div className={styles.benefitItem}>• Free tailoring consultation available</div>
                            </div>
                        </div>

                        {/* --- NEW: Store Context --- */}
                        <p className={styles.exclusiveText}>
                            Available for immediate in-store pickup.
                        </p>

                        {/* Spacer for sticky actions */}
                        <div style={{ height: 120 }}></div>
                    </div>

                    <div className={styles.stickyActions}>
                        <div className={styles.actionsInner}>
                            <SecondaryButton onClick={handleAddToCart} className={styles.cartBtn}>
                                {showAddedToast ? "Added! ✓" : "Add to Cart"}
                            </SecondaryButton>
                            <PrimaryButton onClick={handleBuyNow} className={styles.buyBtn}>
                                Buy Now
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ProductDetails;
