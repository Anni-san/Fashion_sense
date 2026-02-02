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

    // Default size selection logic (e.g. recommend M)
    const [selectedSize, setSelectedSize] = useState('M');

    if (!product) return <div>Product not found</div>;

    const handleAddToCart = () => {
        addToCart(product, selectedSize);
        navigate('/cart');
    };

    const handleBuyNow = () => {
        addToCart(product, selectedSize);
        navigate('/checkout');
    };

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

            <div className={styles.layout}>
                <div className={styles.imageCol}>
                    <img src={product.image} alt={product.name} className={styles.image} />
                </div>

                <div className={styles.infoCol}>
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
                        <div className={styles.detailRow}>
                            <span>Material</span>
                            <span>{product.material}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span>Fit</span>
                            <span>{product.fit}</span>
                        </div>
                        <div className={styles.iconsRow}>
                            {/* Simple icons text for care */}
                            <span>🧴 {product.care}</span>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Select Size</h3>
                        <div className={styles.sizeGrid}>
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.selected : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <p className={styles.sizeHint}>Recommended for you: <strong>M</strong></p>
                    </div>

                    <div className={styles.actions}>
                        <SecondaryButton onClick={handleAddToCart}>Add to Cart</SecondaryButton>
                        <PrimaryButton onClick={handleBuyNow}>Buy Now</PrimaryButton>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ProductDetails;
