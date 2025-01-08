// src/components/SalesScreen/SalesScreen.tsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SalesScreen.module.css';
import Header from '../Dashboard/Header';
import Cart from '../Cart/Cart';
import { CartContext } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import SalesContent from './SalesContent';

const SalesScreen: React.FC = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error('SalesScreen must be used within a CartProvider');
  }
  const { items, addItem, incrementItem, decrementItem } = cartContext;
  const { products, fetchAllProducts } = useProducts();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

 

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchAllProducts();
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchAllProducts]);

  
 

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className={styles.salesScreen}>
      <Header onSearchChange={setSearchTerm} />
 

      <div className={styles.mainContent}>
        {/* LEFT SIDE (SalesContent) */}
        <SalesContent
          loading={loading}
          products={products}
          addItem={addItem}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />

        {/* RIGHT SIDE (Cart) */}
        <div className={styles.rightSide}>
          <Cart
            items={items}
            onCheckout={handleCheckout}
            incrementItem={incrementItem}
            decrementItem={decrementItem}
          />
        </div>
      </div>

     
    </div>
  );
};

export default SalesScreen;
