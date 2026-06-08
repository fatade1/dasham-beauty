'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getSiteSettings } from '@/lib/storage';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = 'dashambeautylounge@gmail.com';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.warn('Firebase login failed, trying fallback auto-migration:', err);

      // If account does not exist in Auth database, or standard credentials fail check
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
        try {
          const settings = await getSiteSettings();
          if (password === settings.adminPasswordHash) {
            // Auto-create account programmatically on correct legacy password input
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
            return;
          }
        } catch (migrationErr) {
          console.error('Legacy password check / auto-registration error:', migrationErr);
        }
      }

      setError('Incorrect password. Please try again.');
      setLoading(false);
    }
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
