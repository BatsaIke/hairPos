import React, { useState } from "react";
import styles from "./BillingDetails.module.css";

interface BillingDetailsProps {
  onPay: (name: string, number: string) => void;
  onCancel: () => void;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({ onPay, onCancel }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const handlePayClick = () => {
    if (name || number) {
      onPay(name, number);
    } else {
      alert("Please fill out name or number fields.");
    }
  };

  return (
    <div className={styles.billingDetails}>
      <label className={styles.inputLabel}>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputField}
          required
        />
      </label>
      <label className={styles.inputLabel}>
        Phone Number:
        <input
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className={styles.inputField}
          required
        />
      </label>
      <div className={styles.modalActions}>
        <button className={styles.payButton} onClick={handlePayClick}>
          Pay
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BillingDetails;
