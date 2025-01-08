import React from 'react';
import spinner from './spinner.gif';
import styles from './Spinner.module.css';

interface SpinnerProps {
  /** Optional message to display under the spinner */
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => (
  <div className={styles.spinnerContainer}>
    <img
      src={spinner}
      style={{ width: '200px', display: 'block', margin: '0 auto' }}
      alt="Loading..."
    />
    <p className={styles.spinnerText}>{message || 'Loading... Please wait'}</p>
  </div>
);

export default Spinner;
