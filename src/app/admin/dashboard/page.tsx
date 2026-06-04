'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBookings } from '@/lib/storage';
import { Booking, BookingStatus } from '@/lib/types';
import { formatNaira, formatDate, formatTime, BOOKING_STATUS_CONFIG } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const count = (status: BookingStatus) => bookings.filter((b) => b.bookingStatus === status).length;
  const recent = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);

  const STATS = [
    { label: 'Total Bookings', value: bookings.length, color: '#080F0F', bg: '#FFF7DC' },
    { label: 'Pending Payment', value: count('pending_payment'), color: '#92400e', bg: '#fef3c7' },
    { label: 'Payment Submitted', value: count('payment_submitted'), color: '#1e40af', bg: '#dbeafe' },
    { label: 'Confirmed', value: count('confirmed'), color: '#065f46', bg: '#d1fae5' },
    { label: 'Completed', value: count('completed'), color: '#374151', bg: '#f3f4f6' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <Link href="/book-appointment" target="_blank" className="btn btn--primary btn--sm">
          + New Booking
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.statCard} style={{ background: stat.bg }}>
            <span className={styles.statNum} style={{ color: stat.color }}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Bookings</h2>
          <Link href="/admin/bookings" className="btn btn--secondary btn--sm">View All</Link>
        </div>

        {recent.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📋</span>
            <p>No bookings yet. New appointment requests will appear here.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className={styles.customerCell}>
                        <span className={styles.customerName}>{b.customerName}</span>
                        <span className={styles.customerPhone}>{b.phone}</span>
                      </div>
                    </td>
                    <td>{b.serviceName}</td>
                    <td>
                      <div>
                        <div>{formatDate(b.preferredDate).split(',')[0]}, {b.preferredDate.slice(5).replace('-', '/')}</div>
                        <div className={styles.tableSubtext}>{formatTime(b.preferredTime)}</div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.amount}>
                        {b.depositAmount > 0 ? formatNaira(b.depositAmount) : '—'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge type="booking" status={b.bookingStatus} />
                    </td>
                    <td>
                      <Link href={`/admin/bookings/${b.id}`} className="btn btn--secondary btn--sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
