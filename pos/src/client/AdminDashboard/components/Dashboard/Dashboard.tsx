
// Dashboard.tsx
import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
};

export default Dashboard;