import React, { useEffect, useMemo, useState } from 'react';
import styles from './Products.module.css';
import { Product, useProducts } from '../../../components/context/ProductContext';
import Pagination from '../../../components/UI/pagination/Pagination';
import AddProductModal from '../../../components/Product/AddProducts/AddProductModal'; 

const Products: React.FC = () => {
  const { products, fetchAllProducts, deleteProduct } = useProducts();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null); // Explicitly typed
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [filterDate, setFilterDate] = useState(''); 


  useEffect(() => {
    fetchAllProducts(); 
  }, [fetchAllProducts]);

  // Calculate total number of products
  const totalProducts = products.length;

  // Calculate total value by category
  const totalValueByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!product.category) return acc;
      acc[product.category] = (acc[product.category] || 0) + product.regularPrice * product.inStock;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  // Filter products by date if a filter is set
  const filteredProducts = useMemo(() => {
    if (!filterDate) return products;
    const filterTimestamp = new Date(filterDate).getTime();
    return products.filter((product) => {
      const productTimestamp = new Date(product.createdAt || '').getTime();
      return productTimestamp >= filterTimestamp;
    });
  }, [filterDate, products]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filterDate changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDate]);

  // Handle delete product
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
    setProductToEdit(null); // Reset product to edit for adding
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product); // Set product to edit
    setIsAddProductOpen(true);
  };

  const handleCloseAddProduct = () => {
    setProductToEdit(null); // Reset product on close
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
              {category}: ${value.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>

      <button className={styles.addButton} onClick={handleOpenAddProduct}>
        Add Product
      </button>

      {paginatedProducts.length === 0 ? (
        <div className={styles.noProducts}>
          No products for the selected date.
        </div>
      ) : (
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
            {paginatedProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category || 'Uncategorized'}</td>
                <td>${product.regularPrice.toFixed(2)}</td>
                <td>{product.inStock}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleOpenEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={handleCloseAddProduct}
        productToEdit={productToEdit} // Pass the product to edit
      />
    </div>
  );
};

export default Products;
