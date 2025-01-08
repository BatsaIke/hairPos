import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useAuth } from '../../components/context/AuthProvider';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/sales');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Sign In</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
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
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className={styles.footer}>
          <p>
            Forgot your password?{' '}
            <span
              className={styles.link}
              onClick={() => navigate('/forgot-password')}
            >
              Reset here
            </span>
          </p>
          <p>
            Don't have an account?{' '}
            <span
              className={styles.link}
              onClick={() => navigate('/signup')}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
