'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSiteSettings, setAdminAuth } from '@/lib/storage';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const settings = getSiteSettings();
      if (password === settings.adminPasswordHash) {
        setAdminAuth(true);
        router.push('/admin/dashboard');
      } else {
        setError('Incorrect password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <img
            src="/images/logo-dark.png"
            alt="Dasham Beauty Lounge Logo"
            className={styles.loginLogoImg}
          />
        </div>

        <h1 className={styles.loginTitle}>Admin Login</h1>
        <p className={styles.loginDesc}>Enter your password to access the admin dashboard.</p>

        <form onSubmit={handleLogin} className={styles.loginForm} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoComplete="current-password"
              required
            />
            {error && <p className="form-error">{error}</p>}
          </div>
          <button
            type="submit"
            className={`btn btn--primary btn--full ${styles.loginBtn}`}
            disabled={loading || !password}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
