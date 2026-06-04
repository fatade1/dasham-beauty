'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { initializeDefaultData } from '@/lib/init';
import { getServices } from '@/lib/storage';
import { formatPrice, CATEGORY_ICONS, whatsappUrl } from '@/lib/utils';
import { Service, ServiceCategory } from '@/lib/types';
import styles from './page.module.css';

const CATEGORIES: ServiceCategory[] = [
  'Pedicure', 'Massage', 'Facials', 'Lash Extensions',
  'Nails', 'Body Treatments', 'Waxing',
];

const CATEGORY_IMAGES: Record<string, string> = {
  'Pedicure': '/images/services/pedicure.png',
  'Massage': '/images/services/massage.png',
  'Facials': '/images/services/facials.png',
  'Lash Extensions': '/images/services/lashes.png',
  'Nails': '/images/services/nails.png',
  'Body Treatments': '/images/services/body.png',
  'Waxing': '/images/services/waxing.png',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('Pedicure');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    initializeDefaultData();
    setServices(getServices().filter((s) => s.status === 'active'));

    // Handle hash navigation
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matched = CATEGORIES.find(
        (c) => c.toLowerCase().replace(/ /g, '-') === hash
      );
      if (matched) setActiveCategory(matched);
    }
  }, []);

  const scrollToCategory = (cat: ServiceCategory) => {
    setActiveCategory(cat);
    const el = sectionRefs.current[cat];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categoryServices = (cat: ServiceCategory) =>
    services.filter((s) => s.category === cat);

  const customUrl = whatsappUrl(
    '08143137185',
    "Hello Dasham Beauty Lounge, I cannot find the service I want. Please assist me."
  );

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="section-label text-gold">What We Offer</p>
          <h1 className="heading-page text-cream" style={{ marginBottom: '1rem' }}>
            Our Services & Prices
          </h1>
          <p style={{ color: 'rgba(255,247,220,0.7)', fontSize: '1.0625rem', lineHeight: 1.75, maxWidth: '54ch' }}>
            Browse our full menu of beauty and wellness treatments. Find your service,
            check the price, and book your appointment in minutes.
          </p>
        </div>
      </section>

      {/* Sticky Category Tabs */}
      <div className={styles.tabs}>
        <div className="container">
          <div className={styles.tabsInner} role="tablist" aria-label="Service categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
                onClick={() => scrollToCategory(cat)}
              >
                <span className={styles.tabIcon}>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Sections */}
      <div className="section">
        <div className="container">
          {CATEGORIES.map((cat) => {
            const catServices = categoryServices(cat);
            const slug = cat.toLowerCase().replace(/ /g, '-');
            return (
              <section
                key={cat}
                id={slug}
                ref={(el) => { sectionRefs.current[cat] = el; }}
                className={styles.categorySection}
              >
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryHeaderIcon}>{CATEGORY_ICONS[cat]}</span>
                  <div>
                    <h2 className={`heading-section ${styles.categoryTitle}`}>{cat}</h2>
                    <span className="gold-line" style={{ marginBlock: '0.5rem' }} />
                  </div>
                </div>

                {catServices.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No services currently listed in this category.</p>
                    <a href={customUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--sm">
                      Ask us on WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className={styles.servicesGrid}>
                    {catServices.map((service) => (
                      <div key={service.id} className={styles.serviceCard}>
                        <div className={styles.serviceCardImageContainer}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={service.imageUrl || CATEGORY_IMAGES[service.category]}
                            alt={service.name}
                            className={styles.serviceCardImage}
                          />
                        </div>
                        <div className={styles.serviceCardContent}>
                          <div className={styles.serviceCardTop}>
                            <h3 className={styles.serviceName}>{service.name}</h3>
                            <span className={`badge ${
                              service.pricingType === 'fixed' ? 'badge--fixed' :
                              service.pricingType === 'range' ? 'badge--range' : 'badge--custom'
                            }`}>
                              {service.pricingType === 'fixed' ? 'Fixed Price' :
                               service.pricingType === 'range' ? 'Price Range' : 'On Consultation'}
                            </span>
                          </div>
                          <p className={styles.serviceDesc}>{service.description}</p>
                          <div className={styles.serviceCardFooter}>
                            <div className={styles.servicePriceGroup}>
                              <span className={styles.servicePrice}>
                                {formatPrice(service.pricingType, service.price, service.minPrice, service.maxPrice)}
                              </span>
                              <span className={styles.servicePaymentType}>
                                {service.pricingType === 'fixed'
                                  ? '• Full payment to confirm'
                                  : service.pricingType === 'range'
                                  ? '• 50% deposit to book'
                                  : '• Price on consultation'}
                              </span>
                            </div>
                            {service.pricingType === 'custom' ? (
                              <a
                                href={customUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn--whatsapp btn--sm"
                              >
                                Chat to Book
                              </a>
                            ) : (
                              <Link
                                href={`/book-appointment?service=${service.id}`}
                                className="btn btn--primary btn--sm"
                              >
                                Book Now
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          {/* Custom Request CTA */}
          <div className={styles.customCta}>
            <div className={styles.customCtaInner}>
              <div>
                <h3 className={styles.customCtaTitle}>Can't find what you need?</h3>
                <p className={styles.customCtaSub}>
                  Chat with us on WhatsApp and we'll help you find exactly what you're looking for.
                </p>
              </div>
              <a
                href={customUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp btn--lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
