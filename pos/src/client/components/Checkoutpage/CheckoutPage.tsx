import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css";
import { CartContext } from "../context/CartContext";
import ReusableModal from "../../UI/ReusableModal";
import BillingDetails from "../BillingDetails/BillingDetails";
import { useOrders } from "../context/OrderContext";
import Spinner from "../UI/Spinner";

const CheckoutPage: React.FC = () => {
  const cartContext = React.useContext(CartContext);
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  if (!cartContext) {
    throw new Error("CheckoutPage must be used within a CartProvider");
  }

  const { items, clearCart } = cartContext;

  // Calculate total price
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handle payment logic
  const handlePay = async (name: string, number: string) => {
    setLoading(true); // Start loading
    try {
      const orderData = {
        customerName: name,
        customerPhone: number,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
      };

      // Create the order
      await createOrder(orderData);

      // Clear cart and navigate to success page
      clearCart();
      setShowModal(false);
      alert("Order placed successfully!");
      navigate("/sales"); // Adjust the route as per your app
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={styles.checkoutPage}>
      {/* Show spinner if loading */}
      {loading && <Spinner message="Placing your order..." />}

      {!loading && (
        <>
          <h2 className={styles.title}>Checkout</h2>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <img
                  src={item.imageUrl || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className={styles.image}
                />
                <div className={styles.details}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.price}>Price: ${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.total}>
            <h3>Total Price:</h3>
            <p>${totalPrice.toFixed(2)}</p>
          </div>

          <div className={styles.actions}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              Back to Cart
            </button>
            <button className={styles.proceedButton} onClick={() => setShowModal(true)}>
              Proceed to Checkout
            </button>
          </div>

          {/* Reusable Modal for Payment */}
          <ReusableModal isOpen={showModal} onClose={() => setShowModal(false)} title="Enter Payment Details">
            <BillingDetails
              onPay={handlePay}
              onCancel={() => setShowModal(false)}
            />
          </ReusableModal>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
