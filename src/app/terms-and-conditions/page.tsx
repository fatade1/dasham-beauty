'use client';

import { useEffect, useState } from 'react';
import { getTerms } from '@/lib/storage';
import Link from 'next/link';
import styles from './page.module.css';

export default function TermsPage() {
  const [terms, setTerms] = useState('');
  const [updated, setUpdated] = useState('');

  useEffect(() => {
    const t = getTerms();
    setTerms(t.content);
    setUpdated(new Date(t.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-label text-gold">Important Information</p>
          <h1 className="heading-page text-cream" style={{ marginBottom: '1rem' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'rgba(255,247,220,0.6)', fontSize: '0.9375rem' }}>
            Last updated: {updated}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.termsLayout}>
            <aside className={styles.termsSidebar}>
              <div className={styles.sidebarCard}>
                <h2 className={styles.sidebarTitle}>Quick Summary</h2>
                <ul className={styles.sidebarList}>
                  <li>By appointment only</li>
                  <li>50% deposit required</li>
                  <li>Late arrivals attract a 10% fee</li>
                  <li>No refunds on cancellations</li>
                  <li>24hr notice for rescheduling</li>
                </ul>
                <Link href="/book-appointment" className="btn btn--primary btn--sm btn--full" style={{ marginTop: '1.5rem' }}>
                  Book Appointment
                </Link>
              </div>
            </aside>

            <div className={styles.termsContent}>
              <div className={styles.termsBox}>
                {terms.split('\n\n').map((paragraph, i) => (
                  <p key={i} className={styles.termsParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className={styles.termsFooter}>
                <p>
                  By booking an appointment with Dasham Beauty Lounge, you confirm that you have read, understood, and agreed to all terms listed above.
                </p>
                <Link href="/book-appointment" className="btn btn--primary btn--lg" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                  I Understand — Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
