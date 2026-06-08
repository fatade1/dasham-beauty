'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { updatePassword } from 'firebase/auth';
import { getSiteSettings, saveSettings } from '@/lib/storage';
import { SiteSettings } from '@/lib/types';
import styles from './page.module.css';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    bankName: 'Access Bank',
    accountName: 'Dasham Beauty Lounge',
    accountNumber: '1234567890',
    whatsappNumber: '08143137185',
    whatsappNumber2: '09027714768',
    instagramHandle: 'dasham_beauty_lounge_',
    tiktokHandle: 'dashambeautylounge_',
    adminPasswordHash: 'dasham2024',
  });
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    async function loadData() {
      const siteSettings = await getSiteSettings();
      setSettings(siteSettings);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (!newPassword) { setPwError('Please enter a new password'); return; }
    if (newPassword.length < 6) { setPwError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); return; }
    
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      }
      await saveSettings({ ...settings, adminPasswordHash: newPassword });
      setSettings((s) => ({ ...s, adminPasswordHash: newPassword }));
      setNewPassword('');
      setConfirmPassword('');
      setPwError('✓ Password updated successfully!');
    } catch (err: any) {
      console.error('Error updating auth password:', err);
      if (err.code === 'auth/requires-recent-login') {
        setPwError('Please log out and log back in to change your password for security.');
      } else {
        setPwError('Failed to update password. Please try again.');
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <button className="btn btn--primary btn--sm" onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      <div className={styles.grid}>
        {/* Payment */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Payment Account</h2>
          <p className={styles.cardDesc}>This is the account customers will transfer their payment to.</p>
          <div className={styles.fieldGroup}>
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input className="form-input" value={settings.bankName} onChange={(e) => setSettings((s) => ({ ...s, bankName: e.target.value }))} placeholder="e.g. Access Bank" />
            </div>
            <div className="form-group">
              <label className="form-label">Account Name</label>
              <input className="form-input" value={settings.accountName} onChange={(e) => setSettings((s) => ({ ...s, accountName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input className="form-input" value={settings.accountNumber} onChange={(e) => setSettings((s) => ({ ...s, accountNumber: e.target.value }))} inputMode="numeric" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Contact & Social Media</h2>
          <div className={styles.fieldGroup}>
            <div className="form-group">
              <label className="form-label">Primary WhatsApp Number</label>
              <input className="form-input" value={settings.whatsappNumber} onChange={(e) => setSettings((s) => ({ ...s, whatsappNumber: e.target.value }))} inputMode="tel" />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary WhatsApp Number</label>
              <input className="form-input" value={settings.whatsappNumber2 ?? ''} onChange={(e) => setSettings((s) => ({ ...s, whatsappNumber2: e.target.value }))} inputMode="tel" />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram Handle</label>
              <div className={styles.inputPrefix}>
                <span>@</span>
                <input className="form-input" value={settings.instagramHandle ?? ''} onChange={(e) => setSettings((s) => ({ ...s, instagramHandle: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">TikTok Handle</label>
              <div className={styles.inputPrefix}>
                <span>@</span>
                <input className="form-input" value={settings.tiktokHandle ?? ''} onChange={(e) => setSettings((s) => ({ ...s, tiktokHandle: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Change Admin Password</h2>
          <p className={styles.cardDesc}>Update the password used to log in to this admin panel.</p>
          <div className={styles.fieldGroup}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPwError(''); }} autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }} autoComplete="new-password" />
            </div>
            {pwError && (
              <p className={`${styles.pwMessage} ${pwError.startsWith('✓') ? styles.pwSuccess : styles.pwError}`}>
                {pwError}
              </p>
            )}
            <button className="btn btn--secondary btn--sm" onClick={handlePasswordChange} style={{ alignSelf: 'flex-start' }}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
