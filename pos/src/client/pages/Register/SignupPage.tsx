import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import { useAuth } from '../../components/context/AuthProvider';

const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signup({ fullName, email, phone }, password);
      navigate('/login'); // Redirect to login after signup
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Sign Up</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <span
              className={styles.link}
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
