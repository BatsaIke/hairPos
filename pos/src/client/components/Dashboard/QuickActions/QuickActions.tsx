import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  onAddProductClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddProductClick }) => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSalesScreenNavigation = () => {
    navigate('/sales'); // Navigate to /sales
  };

  return (
    <div className={styles.quickActions}>
      <h3 className={styles.title}>Quick Actions</h3>
      <button className={styles.button} onClick={onAddProductClick}>
        Add Product
      </button>
      <button className={styles.button}>View Reports</button>
      <button
        className={styles.button}
        onClick={handleSalesScreenNavigation} 
      >
        Sales Screen
      </button>
    </div>
  );
};

export default QuickActions;
