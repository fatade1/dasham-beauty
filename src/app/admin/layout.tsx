'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setAdminAuth } from '@/lib/storage';
import { initializeDefaultData } from '@/lib/init';
import styles from './layout.module.css';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/bookings', icon: '📋', label: 'Bookings' },
  { href: '/admin/services', icon: '💆‍♀️', label: 'Services' },
  { href: '/admin/gallery', icon: '🖼️', label: 'Gallery' },
  { href: '/admin/availability', icon: '📅', label: 'Availability' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
  { href: '/admin/terms', icon: '📄', label: 'Terms & Conditions' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(pathname !== '/admin/login');

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'dashambeautylounge@gmail.com') {
        router.replace('/admin/login');
      } else {
        initializeDefaultData().catch((err) => console.error('Seeding database failed:', err));
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner} />
        <p className={styles.loaderText}>Verifying Session…</p>
      </div>
    );
  }

  const handleLogout = () => {
    setAdminAuth(false);
    router.push('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className={styles.sidebarLogo}>
          <img
            src="/images/logo-light.png"
            alt="Dasham Beauty Lounge Logo"
            className={styles.sidebarLogoImg}
          />
          <span className={styles.sidebarLogoSub}>Admin Panel</span>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname?.startsWith(item.href) ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.viewSiteBtn} target="_blank">
            ↗ View Site
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            ⬡ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
