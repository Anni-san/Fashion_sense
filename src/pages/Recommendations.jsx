import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import ProductCard from '../components/common/ProductCard';
import { products } from '../data/products';
import styles from './Recommendations.module.css';

const Recommendations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetch / skeleton view
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Recommended for you</h2>
                    <p className={styles.subtitle}>Based on your measurements from Step 1</p>
                </div>

                <div className={styles.gridWrapper}>
                    <div className={styles.grid}>
                        {loading ? (
                            // Skeleton Loaders
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonText} style={{ width: '70%' }} />
                                    <div className={styles.skeletonText} style={{ width: '40%' }} />
                                </div>
                            ))
                        ) : (
                            products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={handleProductClick}
                                />
                            ))
                        )}
                    </div>
                    {/* Visual Scroll Cue Gradient */}
                    {!loading && <div className={styles.scrollCue} />}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Recommendations;
