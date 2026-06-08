'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBookingById, updateBooking } from '@/lib/storage';
import { Booking, BookingStatus, PaymentStatus } from '@/lib/types';
import { formatNaira, formatDate, formatTime, whatsappUrl } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import styles from './page.module.css';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      const b = await getBookingById(id);
      if (!b) {
        router.push('/admin/bookings');
        return;
      }
      setBooking(b);
      setAdminNote(b.adminNote ?? '');
    }
    loadData();
  }, [id, router]);

  if (!booking) return null;

  const reload = async () => {
    const b = await getBookingById(id);
    setBooking(b);
  };

  const setStatus = async (bookingStatus: BookingStatus, paymentStatus: PaymentStatus) => {
    await updateBooking(id, { bookingStatus, paymentStatus });
    await reload();
  };

  const saveNote = async () => {
    setSaving(true);
    await updateBooking(id, { adminNote });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const waUrl = whatsappUrl(
    booking.phone,
    `Hello ${booking.customerName}, this is Dasham Beauty Lounge. We are reaching out regarding your appointment booking.`
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link href="/admin/bookings" className={styles.backBtn}>← Bookings</Link>
        <h1 className={styles.pageTitle}>Booking #{id.toUpperCase()}</h1>
      </div>

      <div className={styles.layout}>
        {/* Main */}
        <div className={styles.main}>
          {/* Customer Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detail}><span>Name</span><strong>{booking.customerName}</strong></div>
              <div className={styles.detail}><span>Phone</span><a href={`tel:${booking.phone}`} className={styles.link}>{booking.phone}</a></div>
              <div className={styles.detail}><span>Email</span><span>{booking.email || '—'}</span></div>
              <div className={styles.detail}><span>Booked on</span><span>{new Date(booking.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--sm" style={{ marginTop: '1rem' }}>
              WhatsApp Customer
            </a>
          </div>

          {/* Appointment Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Appointment Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detail}><span>Date</span><strong>{formatDate(booking.preferredDate)}</strong></div>
              <div className={styles.detail}><span>Time</span><strong>{formatTime(booking.preferredTime)}</strong></div>
              {booking.notes && <div className={styles.detail} style={{ gridColumn: '1/-1' }}><span>Notes</span><span>{booking.notes}</span></div>}
            </div>

            {booking.selectedServices && booking.selectedServices.length > 0 ? (
              <div className={styles.itemizedServices}>
                <h3 className={styles.subsectionTitle}>Selected Services</h3>
                <div className={styles.tableWrapper}>
                  <table className={styles.servicesTable}>
                    <thead>
                      <tr>
                        <th>Service Name</th>
                        <th>Category</th>
                        <th>Pricing Type</th>
                        <th>Price</th>
                        <th>Deposit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.selectedServices.map((s, idx) => {
                        const depVal = Math.round(s.price * (s.depositPercent / 100));
                        return (
                          <tr key={idx}>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.category}</td>
                            <td style={{ textTransform: 'capitalize' }}>{s.pricingType}</td>
                            <td>{s.pricingType === 'custom' ? 'Consultation' : formatNaira(s.price)}</td>
                            <td>{depVal > 0 ? `${formatNaira(depVal)} (${s.depositPercent}%)` : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className={styles.detailsGrid} style={{ marginTop: '1rem', borderTop: '1px solid var(--clr-border-subtle)', paddingTop: '1rem' }}>
                <div className={styles.detail}><span>Service</span><strong>{booking.serviceName}</strong></div>
                <div className={styles.detail}><span>Category</span><span>{booking.serviceCategory}</span></div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Information</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detail}><span>Pricing Type</span><span style={{ textTransform: 'capitalize' }}>{booking.pricingType}</span></div>
              <div className={styles.detail}><span>Deposit Amount</span><strong style={{ color: 'var(--clr-red)' }}>{booking.depositAmount > 0 ? formatNaira(booking.depositAmount) : '—'}</strong></div>
              <div className={styles.detail}><span>Payment Status</span><StatusBadge type="payment" status={booking.paymentStatus} /></div>
              {booking.transactionReference && (
                <div className={styles.detail}><span>Transaction Ref</span><code className={styles.code}>{booking.transactionReference}</code></div>
              )}
              {booking.nameUsedForTransfer && (
                <div className={styles.detail}><span>Transfer Name</span><span>{booking.nameUsedForTransfer}</span></div>
              )}
            </div>

            {booking.paymentProof && (
              <div className={styles.proofWrapper}>
                <p className={styles.proofLabel}>Payment Proof</p>
                {booking.paymentProof.startsWith('data:image') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={booking.paymentProof} alt="Payment proof" className={styles.proofImg} />
                ) : (
                  <a
                    href={booking.paymentProof}
                    download={booking.paymentProofName ?? 'payment-proof.pdf'}
                    className="btn btn--secondary btn--sm"
                  >
                    ⬇ Download Proof ({booking.paymentProofName})
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Admin Note */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Admin Note</h2>
            <textarea
              className="form-textarea"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add an internal note about this booking…"
              rows={4}
            />
            <button
              onClick={saveNote}
              disabled={saving}
              className="btn btn--secondary btn--sm"
              style={{ marginTop: '0.75rem' }}
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Note'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.statusCard}>
            <h3 className={styles.statusTitle}>Booking Status</h3>
            <div className={styles.statusCurrent}>
              <StatusBadge type="booking" status={booking.bookingStatus} />
            </div>
            <div className={styles.statusActions}>
              <button
                onClick={() => setStatus('confirmed', 'full_payment_confirmed')}
                className={`btn btn--sm ${styles.confirmBtn}`}
                disabled={booking.bookingStatus === 'confirmed'}
              >
                ✓ Confirm Payment
              </button>
              <button
                onClick={() => setStatus('completed', booking.paymentStatus)}
                className="btn btn--secondary btn--sm"
                disabled={booking.bookingStatus === 'completed'}
              >
                Mark Completed
              </button>
              <button
                onClick={() => setStatus('rejected', 'rejected')}
                className={styles.rejectBtn}
                disabled={booking.bookingStatus === 'rejected'}
              >
                ✗ Reject Payment
              </button>
              <button
                onClick={() => setStatus('cancelled', booking.paymentStatus)}
                className={styles.cancelBtn}
                disabled={booking.bookingStatus === 'cancelled'}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
