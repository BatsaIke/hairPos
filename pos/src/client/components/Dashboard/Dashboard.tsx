import React, { useEffect, useState, useCallback } from 'react';
import styles from './Dashboard.module.css';
import Header from './Header';
import MetricsCard from './MetricsCard/MetricsCard';
import NotificationList from './NotificationList/NotificationList';
import QuickActions from './QuickActions/QuickActions';
import AddProductModal from '../Product/AddProducts/AddProductModal';
import DateFilter from '../UI/DateFilter';
import { useOrders } from '../context/OrderContext';

const Dashboard: React.FC = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const { orders, fetchAllOrders } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Open and close add product modal
  const handleOpenAddProduct = () => setIsAddProductOpen(true);
  const handleCloseAddProduct = () => setIsAddProductOpen(false);

  // Fetch all orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Filter orders based on the selected date range
  useEffect(() => {
    if (selectedDateRange) {
      const { start, end } = selectedDateRange;
  
      const filtered = orders.filter((order) => {
        if (!order.createdAt) return false; // Skip orders without createdAt
        const createdAt = new Date(order.createdAt); // Parse createdAt as Date
        return createdAt >= start && createdAt <= end;
      });
  
      console.log('Filtered Orders:', filtered); // Debug filtered orders
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // Reset to all orders if no date range is selected
    }
  }, [orders, selectedDateRange]);
  

  // Calculate metrics
  const totalSales = filteredOrders.length; // Total orders in the range
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalProductsSold = filteredOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  return (
    <div className={styles.dashboard}>
      <Header onSearchChange={setSearchTerm} />
      <DateFilter onDateChange={setSelectedDateRange} />

      <div className={styles.mainContent}>
        <div className={styles.metrics}>
          {filteredOrders.length === 0 ? (
            <p>No orders found for the selected period.</p>
          ) : (
            <>
              <MetricsCard title="Total Sales" value={`$${totalRevenue.toFixed(2)}`} />
              <MetricsCard title="Total Orders" value={totalSales.toString()} />
              <MetricsCard title="Products Sold" value={totalProductsSold.toString()} />
            </>
          )}
        </div>

        <div className={styles.quickActions}>
          <QuickActions onAddProductClick={handleOpenAddProduct} />
        </div>

        <div className={styles.notifications}>
          <NotificationList />
        </div>
      </div>

      <AddProductModal isOpen={isAddProductOpen} onClose={handleCloseAddProduct} />
    </div>
  );
};

export default Dashboard;
