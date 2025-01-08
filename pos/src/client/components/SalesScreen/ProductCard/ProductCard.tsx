import React from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  name: string;
  price: number;
  imageUrl?: string; // <-- new optional prop for the product image
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl, onAddToCart }) => {
  return (
    <div className={styles.productCard}>
      {/* Show image if present */}
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt={name} className={styles.productImage} />
        </div>
      )}

      <h3 className={styles.productName}>{name}</h3>
      <p className={styles.productPrice}>${price.toFixed(2)}</p>

      <button className={styles.addButton} onClick={onAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
