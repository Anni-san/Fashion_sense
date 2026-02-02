import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/common/PageWrapper';
import ProductCard from '../components/common/ProductCard';
import { products } from '../data/products';
import styles from './Recommendations.module.css';

const Recommendations = () => {
    const navigate = useNavigate();

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Recommended for you</h2>
                    {/* Could add filter/sort here if needed */}
                </div>

                <div className={styles.grid}>
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={handleProductClick}
                        />
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
};

export default Recommendations;
