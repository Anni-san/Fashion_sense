import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onClick }) => {
    return (
        <div className={styles.card} onClick={() => onClick(product)}>
            <div className={styles.imageWrapper}>
                <img src={product.image} alt={product.name} className={styles.image} />
                <div className={styles.fitBadge}>
                    <span className={styles.star}>⭐</span> {product.fitScore}% Match
                </div>
            </div>
            <div className={styles.details}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.price}>${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;
