'use client';

import { useEffect, useState, useRef } from 'react';
import { getGallery } from '@/lib/storage';
import { GalleryImage, GalleryCategory } from '@/lib/types';
import styles from './page.module.css';

const FILTER_TABS: GalleryCategory[] = ['Nails', 'Lashes', 'Facials', 'Pedicure', 'Spa', 'Waxing', 'Other'];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<'All' | GalleryCategory>('All');
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    async function loadData() {
      const allGallery = await getGallery();
      setImages(allGallery.filter((g) => g.status === 'active'));
    }
    loadData();
  }, []);

  const filtered = filter === 'All' ? images : images.filter((img) => img.category === filter);

  const openLightbox = (img: GalleryImage) => {
    setLightboxImg(img);
    dialogRef.current?.showModal();
  };

  const closeLightbox = () => {
    dialogRef.current?.close();
    setLightboxImg(null);
  };

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="section-label text-gold">Our Work</p>
          <h1 className="heading-page text-cream" style={{ marginBottom: '1rem' }}>
            Gallery
          </h1>
          <p style={{ color: 'rgba(255,247,220,0.7)', fontSize: '1.0625rem', lineHeight: 1.75, maxWidth: '50ch' }}>
            Real results, real clients. See what Dasham Beauty Lounge can do for you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter Tabs */}
          <div className={styles.filterTabs} role="tablist">
            <button
              role="tab"
              aria-selected={filter === 'All'}
              className={`${styles.filterTab} ${filter === 'All' ? styles.filterTabActive : ''}`}
              onClick={() => setFilter('All')}
            >
              All
            </button>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={filter === tab}
                className={`${styles.filterTab} ${filter === tab ? styles.filterTabActive : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filtered.length > 0 ? (
            <div className={styles.gallery}>
              {filtered.map((img) => (
                <button
                  key={img.id}
                  className={styles.galleryItem}
                  onClick={() => openLightbox(img)}
                  aria-label={`View ${img.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.title} className={styles.galleryImg} />
                  <div className={styles.galleryOverlay}>
                    <span className={styles.galleryLabel}>{img.title}</span>
                    <span className={styles.galleryCat}>{img.category}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🖼️</span>
              <h3 className={styles.emptyTitle}>No images yet</h3>
              <p className={styles.emptyDesc}>
                {filter === 'All'
                  ? 'No gallery images have been uploaded yet. Check back soon!'
                  : `No images in the ${filter} category yet.`}
              </p>
              {filter !== 'All' && (
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => setFilter('All')}
                >
                  View All
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClick={(e) => { if (e.target === dialogRef.current) closeLightbox(); }}
      >
        {lightboxImg && (
          <div className={styles.lightboxContent}>
            <button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImg.src}
              alt={lightboxImg.title}
              className={styles.lightboxImg}
            />
            <div className={styles.lightboxCaption}>
              <span>{lightboxImg.title}</span>
              <span className={`badge badge--range`}>{lightboxImg.category}</span>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
