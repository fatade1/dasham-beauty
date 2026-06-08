'use client';

import { useEffect, useState } from 'react';
import { getAvailability, saveAvailability } from '@/lib/storage';
import { Availability } from '@/lib/types';
import styles from './page.module.css';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function AdminAvailabilityPage() {
  const [avail, setAvail] = useState<Availability>({
    workingDays: [1, 2, 3, 4, 5, 6],
    openTime: '10:00',
    closeTime: '19:00',
    slotDurationMinutes: 30,
    blockedDates: [],
    maxBookingsPerSlot: 1,
  });
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getAvailability();
      setAvail(data);
    }
    loadData();
  }, []);

  const toggleDay = (d: number) => {
    setAvail((a) => ({
      ...a,
      workingDays: a.workingDays.includes(d)
        ? a.workingDays.filter((x) => x !== d)
        : [...a.workingDays, d].sort(),
    }));
  };

  const addBlockedDate = () => {
    if (!newBlockedDate || avail.blockedDates.includes(newBlockedDate)) return;
    setAvail((a) => ({ ...a, blockedDates: [...a.blockedDates, newBlockedDate].sort() }));
    setNewBlockedDate('');
  };

  const removeBlockedDate = (d: string) => {
    setAvail((a) => ({ ...a, blockedDates: a.blockedDates.filter((x) => x !== d) }));
  };

  const handleSave = async () => {
    await saveAvailability(avail);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Availability Settings</h1>
        <button className="btn btn--primary btn--sm" onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      <div className={styles.grid}>
        {/* Working Days */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Working Days</h2>
          <p className={styles.cardDesc}>Select which days you accept bookings.</p>
          <div className={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <label key={day.value} className={`${styles.dayToggle} ${avail.workingDays.includes(day.value) ? styles.dayToggleActive : ''}`}>
                <input
                  type="checkbox"
                  className={styles.hidden}
                  checked={avail.workingDays.includes(day.value)}
                  onChange={() => toggleDay(day.value)}
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Business Hours</h2>
          <p className={styles.cardDesc}>Set your opening and closing times.</p>
          <div className={styles.hoursGrid}>
            <div className="form-group">
              <label className="form-label">Opening Time</label>
              <input type="time" className="form-input" value={avail.openTime} onChange={(e) => setAvail((a) => ({ ...a, openTime: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Closing Time</label>
              <input type="time" className="form-input" value={avail.closeTime} onChange={(e) => setAvail((a) => ({ ...a, closeTime: e.target.value }))} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Appointment Slot Duration (minutes)</label>
            <select className="form-select" value={avail.slotDurationMinutes} onChange={(e) => setAvail((a) => ({ ...a, slotDurationMinutes: Number(e.target.value) }))}>
              {[15, 20, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m}>{m} minutes</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Block Specific Dates</h2>
          <p className={styles.cardDesc}>Block out dates when you're unavailable (holidays, events, etc.)</p>
          <div className={styles.blockRow}>
            <input
              type="date"
              className="form-input"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <button className="btn btn--secondary btn--sm" onClick={addBlockedDate} disabled={!newBlockedDate}>
              Block Date
            </button>
          </div>
          {avail.blockedDates.length === 0 ? (
            <p className={styles.noBlocked}>No dates blocked.</p>
          ) : (
            <div className={styles.blockedList}>
              {avail.blockedDates.map((d) => (
                <div key={d} className={styles.blockedItem}>
                  <span>{new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <button className={styles.removeBtn} onClick={() => removeBlockedDate(d)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
