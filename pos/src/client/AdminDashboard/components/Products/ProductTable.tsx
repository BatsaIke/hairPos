import React from 'react';
import styles from './Products.module.css';
import { Product } from '../../../components/context/ProductContext';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return <div className={styles.noProducts}>No products for the selected date.</div>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>In Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product.name}</td>
            <td>{product.category || 'Uncategorized'}</td>
            <td>${product.regularPrice.toFixed(2)}</td>
            <td>{product.inStock}</td>
            <td>
              <button className={styles.editButton} onClick={() => onEdit(product)}>
                Edit
              </button>
              <button className={styles.deleteButton} onClick={() => onDelete(product._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
