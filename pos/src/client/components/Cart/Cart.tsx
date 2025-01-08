import React from 'react';
import styles from './Cart.module.css';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartProps {
  items: CartItem[];
  onCheckout: () => void;
  incrementItem: (id: string) => void; // Function to increment item quantity
  decrementItem: (id: string) => void; // Function to decrement item quantity
}

const Cart: React.FC<CartProps> = ({ items, onCheckout, incrementItem, decrementItem }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.cart}>
      <h2 className={styles.cartTitle}>Cart</h2>
      {items.length === 0 ? (
        <p className={styles.emptyMessage}>Your cart is empty</p>
      ) : (
        <>
          <ul className={styles.itemList}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <span>{item.name}</span>
                <div className={styles.controls}>
                  <button
                    className={styles.decrementButton}
                    onClick={() => decrementItem(item.id)}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    className={styles.incrementButton}
                    onClick={() => incrementItem(item.id)}
                  >
                    +
                  </button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.total}>
            <strong>Total: </strong>${total.toFixed(2)}
          </div>
          <button
            className={styles.checkoutButton}
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
