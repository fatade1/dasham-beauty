'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBookings } from '@/lib/storage';
import { Booking, BookingStatus } from '@/lib/types';
import { formatNaira, formatDate, formatTime } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import styles from './page.module.css';

const STATUS_FILTERS: (BookingStatus | 'all')[] = [
  'all', 'pending_payment', 'payment_submitted', 'confirmed', 'completed', 'cancelled', 'rejected',
];

const STATUS_LABELS: Record<string, string> = {
  all: 'All',
  pending_payment: 'Pending',
  payment_submitted: 'Submitted',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    async function loadData() {
      const data = await getBookings();
      setBookings(data);
    }
    loadData();
  }, []);

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.bookingStatus === filter);

  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Bookings</h1>
        <span className={styles.pageCount}>{bookings.length} total</span>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={`${styles.filterTab} ${filter === s ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(s)}
          >
            {STATUS_LABELS[s]}
            <span className={styles.filterCount}>
              {s === 'all' ? bookings.length : bookings.filter((b) => b.bookingStatus === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        {sorted.length === 0 ? (
          <div className={styles.emptyState}>
            <span>📋</span>
            <p>No bookings in this category.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Deposit</th>
                  <th>Booking Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div>
                        <div className={styles.customerName}>{b.customerName}</div>
                        <div className={styles.customerPhone}>{b.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{b.serviceName}</div>
                        <div className={styles.tableSubtext}>{b.serviceCategory}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{b.preferredDate}</div>
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
                      <StatusBadge type="payment" status={b.paymentStatus} />
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
