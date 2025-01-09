import React, { useEffect, useMemo, useState } from 'react';
import styles from './Products.module.css';
import { Product, useProducts } from '../../../components/context/ProductContext';

import ProductTable from './ProductTable';
import Pagination from '../../../components/UI/pagination/Pagination';
import AddProductModal from '../../../components/Product/AddProducts/AddProductModal';

const Products: React.FC = () => {
  const { products, fetchAllProducts, deleteProduct } = useProducts();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const totalProducts = products.length;

  const totalValueByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!product.category) return acc;
      acc[product.category] = (acc[product.category] || 0) + product.regularPrice * product.inStock;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const overallTotalValue = useMemo(() => {
    return Object.values(totalValueByCategory).reduce((sum, value) => sum + value, 0);
  }, [totalValueByCategory]);

  const filteredProducts = useMemo(() => {
    if (!filterDate) return products;
    const filterTimestamp = new Date(filterDate).getTime();
    return products.filter((product) => {
      const productTimestamp = new Date(product.createdAt || '').getTime();
      return productTimestamp >= filterTimestamp;
    });
  }, [filterDate, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDate]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        alert('Product deleted successfully.');
      } catch (error) {
        alert('Failed to delete product.');
      }
    }
  };

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsAddProductOpen(true);
  };

  const handleCloseAddProduct = () => {
    setProductToEdit(null);
    setIsAddProductOpen(false);
  };

  return (
    <div className={styles.products}>
      <header className={styles.header}>
        <h1>Products</h1>
        <p>Manage your products here.</p>
        <p>
          <strong>Total Products:</strong> {totalProducts}
        </p>
      </header>

      <section className={styles.summary}>
        <div className={styles.summaryHeader}>
          <h2>Total Value by Category</h2>
          <div className={styles.filter}>
            <label htmlFor="dateFilter">Filter by Date:</label>
            <input
              type="date"
              id="dateFilter"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
        <ul>
          {Object.entries(totalValueByCategory).map(([category, value]) => (
            <li key={category}>
              {category}: ₵{value.toFixed(2)}
            </li>
          ))}
        </ul>
        <div className={styles.overallTotal}>
          <strong>Overall Total: ₵{overallTotalValue.toFixed(2)}</strong>
        </div>
      </section>

      <button className={styles.addButton} onClick={handleOpenAddProduct}>
        Add Product
      </button>

      <ProductTable
        products={paginatedProducts}
        onEdit={handleOpenEditProduct}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={handleCloseAddProduct}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default Products;
