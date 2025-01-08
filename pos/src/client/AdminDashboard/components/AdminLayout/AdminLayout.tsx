import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>POS System</h2>
        <nav className={styles.nav}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/sales"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Sales
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Reports
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Customers
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
