'use client';

import { useEffect, useState, useRef } from 'react';
import { getGallery, saveGalleryImage, updateGalleryImage, deleteGalleryImage, generateId } from '@/lib/storage';
import { GalleryImage, GalleryCategory } from '@/lib/types';
import styles from './page.module.css';

const CATEGORIES: GalleryCategory[] = ['Nails', 'Lashes', 'Facials', 'Pedicure', 'Spa', 'Waxing', 'Other'];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = async () => {
    const all = await getGallery();
    setImages(all);
  };
  
  useEffect(() => {
    reload();
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    Promise.all(files.map((file) => new Promise<GalleryImage>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        resolve({
          id: generateId(),
          src: ev.target!.result as string,
          title: file.name.replace(/\.[^.]+$/, ''),
          category: 'Other',
          status: 'active',
          createdAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    }))).then(async (newImages) => {
      await Promise.all(newImages.map(saveGalleryImage));
      await reload();
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    });
  };

  const toggleStatus = async (id: string, status: 'active' | 'inactive' | 'hidden') => {
    await updateGalleryImage(id, { status: status === 'active' ? 'inactive' : 'active' });
    await reload();
  };

  const handleCategory = async (id: string, category: GalleryCategory) => {
    await updateGalleryImage(id, { category });
    await reload();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this image?')) {
      await deleteGalleryImage(id);
      await reload();
    }
  };

  const handleTitleChange = (id: string, title: string) => {
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, title } : img));
  };

  const saveTitle = async (id: string, title: string) => {
    await updateGalleryImage(id, { title });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gallery</h1>
        <label className="btn btn--primary btn--sm" style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : '+ Upload Images'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
            onChange={handleUpload}
          />
        </label>
      </div>
      <p className={styles.hint}>{images.length} image{images.length !== 1 ? 's' : ''} • Only "Active" images show on the public gallery</p>

      {images.length === 0 ? (
        <div className={styles.emptyState}>
          <span>🖼️</span>
          <p>No images yet. Upload photos to populate the gallery.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {images.map((img) => (
            <div key={img.id} className={`${styles.card} ${img.status === 'inactive' ? styles.cardInactive : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.title} className={styles.cardImg} />
              <div className={styles.cardBody}>
                <input
                  className={styles.titleInput}
                  value={img.title}
                  onChange={(e) => handleTitleChange(img.id, e.target.value)}
                  onBlur={() => saveTitle(img.id, img.title)}
                  placeholder="Title"
                />
                <select
                  className={styles.catSelect}
                  value={img.category}
                  onChange={(e) => handleCategory(img.id, e.target.value as GalleryCategory)}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className={styles.cardActions}>
                  <button
                    className={`btn btn--sm ${img.status === 'active' ? 'btn--secondary' : 'btn--primary'}`}
                    onClick={() => toggleStatus(img.id, img.status)}
                  >
                    {img.status === 'active' ? 'Hide' : 'Show'}
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(img.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
