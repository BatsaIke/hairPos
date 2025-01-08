// src/components/Dashboard/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthProvider';

interface HeaderProps {
  onSearchChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear user session
    navigate('/login'); // Redirect to the login page
  };

  const homeNavigation=()=>{
navigate("/")
  }
  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={homeNavigation}>
        <h1>POS Dashboard</h1>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className={styles.profile}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
