'use client';

import { useEffect, useState } from 'react';
import { getTerms, saveTerms } from '@/lib/storage';
import styles from './page.module.css';

export default function AdminTermsPage() {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(getTerms().content);
  }, []);

  const handleSave = () => {
    saveTerms(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Terms & Conditions</h1>
          <p className={styles.pageDesc}>Edit the T&C content that customers see on the public page.</p>
        </div>
        <button className="btn btn--primary btn--sm" onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      <div className={styles.editorCard}>
        <div className={styles.editorHeader}>
          <p className={styles.editorHint}>
            Each paragraph should be on its own line. Use double line breaks to separate paragraphs.
          </p>
        </div>
        <textarea
          className={styles.editor}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={30}
          spellCheck
        />
      </div>
    </div>
  );
}
