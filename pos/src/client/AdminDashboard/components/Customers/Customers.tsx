import React from 'react';
import styles from './Customers.module.css';

const Customers: React.FC = () => {
  return (
    <div className={styles.customers}>
      <h1>Customers</h1>
      <p>Manage your customers here.</p>
    </div>
  );
};

export default Customers;