'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { initializeDefaultData } from '@/lib/init';
import { getServices, getGallery } from '@/lib/storage';
import { formatPrice, whatsappUrl, CATEGORY_ICONS } from '@/lib/utils';
import { Service, ServiceCategory, GalleryImage } from '@/lib/types';
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

const WHY_ITEMS = [
  {
    icon: '✦',
    title: 'Expert Therapists',
    desc: 'Skilled beauty professionals trained to deliver precise, flawless results every single time.',
  },
  {
    icon: '✧',
    title: 'Premium Hygiene',
    desc: 'We maintain the highest hygiene standards. Every tool is sterilised. Every surface is clean.',
  },
  {
    icon: '◆',
    title: 'Relaxing Environment',
    desc: 'Step into a space designed for calm. Our lounge offers a peaceful escape from everyday life.',
  },
  {
    icon: '◇',
    title: 'Affordable Luxury',
    desc: "High-end beauty experiences at prices that make sense. Quality shouldn't cost a fortune.",
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose Your Service',
    desc: 'Browse our full menu of beauty and wellness treatments. Find exactly what you need.',
  },
  {
    step: '02',
    title: 'Book Your Slot',
    desc: 'Select your preferred date and time. Fill in your details and confirm your appointment.',
  },
  {
    step: '03',
    title: 'Secure with Payment',
    desc: 'Make your payment via bank transfer. Your booking is confirmed once payment is verified.',
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    initializeDefaultData();
    const services = getServices().filter((s) => s.status === 'active');
    // Pick 3 featured services across different categories
    const featured: Service[] = [];
    const seen = new Set<string>();
    for (const s of services) {
      if (!seen.has(s.category) && featured.length < 6) {
        featured.push(s);
        seen.add(s.category);
      }
    }
    setFeaturedServices(featured);
    setGalleryImages(getGallery().filter((g) => g.status === 'active').slice(0, 6));
  }, []);

  const enquiryUrl = whatsappUrl(
    '08143137185',
    'Hello Dasham Beauty Lounge, I would like to make an enquiry.'
  );

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <p className={`section-label ${styles.heroLabel}`}>Ibadan's #1 Beauty & Wellness Center</p>
            <h1 className={`heading-hero ${styles.heroHeading}`}>
              Ibadan's Beauty<br />& Wellness Standard
            </h1>
            <p className={styles.heroSub}>
              Experience beauty, relaxation, and expert care in one premium lounge.
              From nails and lashes to facials, waxing, massage, and sauna —
              Dasham Beauty Lounge is designed to help you look good, feel good, and relax better.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/book-appointment" className="btn btn--primary btn--lg">
                Book Appointment
              </Link>
              <a href={enquiryUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-lounge.png"
              alt="Relaxing facial spa at Dasham Beauty Lounge"
              className={styles.heroImage}
            />
          </div>
        </div>
        <div className={styles.heroScroll}>
          <div className={styles.scrollIndicator} aria-hidden="true" />
        </div>
      </section>

      {/* ── SERVICE CATEGORIES ─────────────────────────────────────────── */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className="section-label">What We Offer</p>
            <h2 className="heading-section">Our Services</h2>
            <span className="gold-line" />
          </div>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/services#${cat.toLowerCase().replace(/ /g, '-')}`}
                className={styles.categoryCard}
              >
                <span className={styles.categoryIcon}>{CATEGORY_ICONS[cat]}</span>
                <span className={styles.categoryName}>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DASHAM ────────────────────────────────────────────────── */}
      <section className={`section ${styles.whySection}`}>
        <div className="container">
          <div className={styles.whyInner}>
            <div className={styles.whyLeft}>
              <p className="section-label">Why Choose Us</p>
              <h2 className="heading-section">The Dasham Difference</h2>
              <span className="gold-line" />
              <p className={styles.whyDesc}>
                At Dasham Beauty Lounge, we combine expert skill with a luxurious
                environment to give you a beauty and wellness experience that feels
                truly special — every single time.
              </p>
              <div style={{ marginBottom: '2.5rem' }}>
                <Link href="/about" className="btn btn--secondary">
                  Learn About Us
                </Link>
              </div>
              <div className={styles.whyImageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/why-treatment.png"
                  alt="Meticulous nail care and professional beauty treatment at Dasham"
                  className={styles.whyImage}
                />
              </div>
            </div>
            <div className={styles.whyRight}>
              {WHY_ITEMS.map((item) => (
                <div key={item.title} className={styles.whyCard}>
                  <div className={styles.whyCardIcon}>{item.icon}</div>
                  <div>
                    <h3 className={styles.whyCardTitle}>{item.title}</h3>
                    <p className={styles.whyCardDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ─────────────────────────────────────────── */}
      {featuredServices.length > 0 && (
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            <div className={`${styles.sectionHeader} text-center`}>
              <p className="section-label">Our Treatments</p>
              <h2 className="heading-section">Featured Services</h2>
              <span className="gold-line gold-line--center" />
            </div>
            <div className={styles.featuredGrid}>
              {featuredServices.map((service, i) => (
                <div
                  key={service.id}
                  className={`${styles.featuredCard} ${i === 2 || i === 5 ? styles.featuredCardDark : ''}`}
                >
                  <div className={styles.featuredCardImageContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.imageUrl || CATEGORY_IMAGES[service.category]}
                      alt={service.name}
                      className={styles.featuredCardImage}
                    />
                    <div className={styles.featuredCardBadgeOverlay}>
                      <span className={styles.featuredIcon}>{CATEGORY_ICONS[service.category]}</span>
                      <span className={`badge ${
                        service.pricingType === 'fixed' ? 'badge--fixed' :
                        service.pricingType === 'range' ? 'badge--range' : 'badge--custom'
                      }`}>
                        {service.pricingType === 'fixed' ? 'Fixed Price' :
                         service.pricingType === 'range' ? 'Price Range' : 'On Consultation'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.featuredCardContent}>
                    <h3 className={styles.featuredName}>{service.name}</h3>
                    <p className={styles.featuredDesc}>{service.description}</p>
                    <div className={styles.featuredFooter}>
                      <span className={styles.featuredPrice}>
                        {formatPrice(service.pricingType, service.price, service.minPrice, service.maxPrice)}
                      </span>
                      <Link
                        href={`/book-appointment?service=${service.id}`}
                        className={`btn btn--sm ${i === 2 || i === 5 ? 'btn--dark' : 'btn--primary'}`}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.featuredCta}>
              <Link href="/services" className="btn btn--secondary btn--lg">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className={`section ${styles.howSection}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} text-center`}>
            <p className="section-label text-gold">Simple Process</p>
            <h2 className={`heading-section text-cream`}>How to Book</h2>
            <span className="gold-line gold-line--center" />
          </div>
          <div className={styles.howGrid}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className={styles.howCard}>
                <span className={styles.howStep}>{item.step}</span>
                <h3 className={styles.howTitle}>{item.title}</h3>
                <p className={styles.howDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.howCta}>
            <Link href="/book-appointment" className="btn btn--primary btn--lg">
              Book Your Appointment
            </Link>
            <Link href="/terms-and-conditions" className={`btn ${styles.termsBtn}`}>
              Read Our T&C
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ───────────────────────────────────────────── */}
      <section className={`section ${styles.gallerySection}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} text-center`}>
            <p className="section-label">Our Work</p>
            <h2 className="heading-section">Gallery</h2>
            <span className="gold-line gold-line--center" />
            <p className={styles.gallerySubtext}>
              See the results our clients love. Real work, real results.
            </p>
          </div>
          {galleryImages.length > 0 ? (
            <div className={styles.galleryGrid}>
              {galleryImages.map((img) => (
                <div key={img.id} className={styles.galleryItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.title} className={styles.galleryImg} />
                  <div className={styles.galleryOverlay}>
                    <span>{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.galleryPlaceholder}>
              {['💅', '✨', '👁️', '🧖‍♀️', '💎', '🌸'].map((icon, i) => (
                <div key={i} className={styles.galleryPlaceholderItem}>
                  <span className={styles.galleryPlaceholderIcon}>{icon}</span>
                  <span className={styles.galleryPlaceholderLabel}>
                    {['Nails', 'Facials', 'Lashes', 'Spa', 'Pedicure', 'Waxing'][i]}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className={styles.galleryCta}>
            <Link href="/gallery" className="btn btn--secondary btn--lg">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── LOCATION CTA ──────────────────────────────────────────────── */}
      <section className={`section ${styles.locationSection}`}>
        <div className="container">
          <div className={styles.locationGrid}>
            <div className={styles.locationInfo}>
              <p className="section-label">Find Us</p>
              <h2 className="heading-section">Visit Dasham Beauty Lounge</h2>
              <span className="gold-line" />
              <div className={styles.locationDetails}>
                <div className={styles.locationItem}>
                  <span>📍</span>
                  <span>Opposite Kilimanjaro, Samonda, First Floor, Ibadan</span>
                </div>
                <div className={styles.locationItem}>
                  <span>🕐</span>
                  <span>Monday – Saturday: 10:00 AM – 7:00 PM</span>
                </div>
                <div className={styles.locationItem}>
                  <span>📞</span>
                  <div>
                    <a href="tel:08143137185">08143137185</a>
                    {' / '}
                    <a href="tel:09027714768">09027714768</a>
                  </div>
                </div>
              </div>
              <div className={styles.locationCtas}>
                <Link href="/book-appointment" className="btn btn--primary">
                  Book Now
                </Link>
                <a
                  href={enquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className={styles.locationMap}>
              <iframe
                title="Dasham Beauty Lounge location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.2!2d3.9086!3d7.4076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjQnMjcuNCJOIDPCsDU0JzMwLjkiRQ!5e0!3m2!1sen!2sng!4v1"
                width="100%"
                height="340"
                style={{ border: 0, borderRadius: 'var(--radius-xl)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ──────────────────────────────────────────── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaBannerInner}>
            <div>
              <h2 className={`heading-section text-cream`}>
                Ready to Look & Feel Your Best?
              </h2>
              <p className={styles.ctaBannerSub}>
                Book your appointment today and experience premium beauty care in the heart of Ibadan.
              </p>
            </div>
            <div className={styles.ctaBannerActions}>
              <Link href="/book-appointment" className="btn btn--dark btn--lg">
                Book Appointment
              </Link>
              <Link href="/services" className={`btn btn--lg ${styles.ctaViewBtn}`}>
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
