import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Dasham Beauty Lounge — Ibadan\'s premium beauty and wellness destination. Skilled therapists, hygienic standards, and relaxing environment.',
};

const VALUES = [
  {
    icon: '✦',
    title: 'Expert Professionals',
    desc: 'Our team consists of trained, experienced beauty therapists who stay updated on the latest techniques and trends.',
  },
  {
    icon: '✧',
    title: 'Strict Hygiene Standards',
    desc: 'We sterilise every tool, sanitise every surface, and use single-use items where required. Your safety is paramount.',
  },
  {
    icon: '◆',
    title: 'Relaxing Atmosphere',
    desc: 'From the moment you walk in, you\'ll feel the calm. Our space is designed to be your escape from the everyday.',
  },
  {
    icon: '◇',
    title: 'Affordable Luxury',
    desc: 'Premium beauty and wellness shouldn\'t be a privilege. We price our services to be accessible without compromising quality.',
  },
  {
    icon: '★',
    title: 'Reliable & Consistent',
    desc: 'We show up, we deliver, and we care. Every appointment is treated with the same level of professionalism and attention.',
  },
  {
    icon: '✿',
    title: 'Client-First Approach',
    desc: 'Your satisfaction is our priority. We listen to your needs, consult before every treatment, and adjust to your preferences.',
  },
];

const SERVICES_OFFERED = [
  'Pedicure', 'Massage Therapy', 'Facial Treatments',
  'Lash Extensions', 'Nail Services', 'Body Treatments', 'Waxing',
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="section-label text-gold">Our Story</p>
          <h1 className="heading-page text-cream" style={{ marginBottom: '1rem' }}>
            About Dasham Beauty Lounge
          </h1>
          <p className={styles.heroSub}>
            A premium beauty and wellness center built to give Ibadan's women an experience
            that matches their standard.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <p className="section-label">Who We Are</p>
              <h2 className="heading-section">Dasham Beauty Lounge</h2>
              <span className="gold-line" />
              <p>
                Dasham Beauty Lounge is Ibadan's premier beauty and wellness destination.
                We are a full-service beauty lounge offering expert treatments in nails, lashes,
                facials, massage, waxing, pedicure, and body therapies — all under one roof.
              </p>
              <p>
                We were created with a simple but powerful belief: every woman deserves to feel
                beautiful, relaxed, and cared for without having to compromise on quality.
                Whether you're coming in for a quick nail appointment or a full body treatment,
                we bring the same dedication and precision to every single session.
              </p>
              <p>
                Located in Samonda, Ibadan, our lounge is more than a place to get beauty services —
                it's your space to breathe, unwind, and walk out feeling like the best version of yourself.
              </p>
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.storyImageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about-lounge.png"
                  alt="Dasham Beauty Lounge luxury interior in Samonda, Ibadan"
                  className={styles.storyImage}
                />
                <div className={styles.storyImageBadge}>
                  <span className={styles.storyBadgeIcon}>✦</span>
                  <div>
                    <p className={styles.storyBadgeTitle}>Premium Space</p>
                    <p className={styles.storyBadgeSub}>Samonda, Ibadan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <p className="section-label">Our Promise</p>
            <h2 className="heading-section">What We Stand For</h2>
            <span className="gold-line gold-line--center" />
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className={`section ${styles.servicesListSection}`}>
        <div className="container">
          <div className={styles.servicesListInner}>
            <div className={styles.servicesListLeft}>
              <p className="section-label">Our Expertise</p>
              <h2 className="heading-section">Services We Offer</h2>
              <span className="gold-line" />
              <p className={styles.servicesListDesc}>
                We offer a wide range of beauty and wellness treatments tailored
                to meet every need — from everyday maintenance to luxurious indulgence.
              </p>
              <div className={styles.servicesList}>
                {SERVICES_OFFERED.map((s) => (
                  <span key={s} className={styles.servicesListItem}>
                    <span className={styles.servicesListDot}>✦</span>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.servicesListRight}>
              <div className={styles.statsCard}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>7+</span>
                  <span className={styles.statLabel}>Service Categories</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNum}>100%</span>
                  <span className={styles.statLabel}>Client Satisfaction Goal</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNum}>Mon–Sat</span>
                  <span className={styles.statLabel}>10 AM – 7 PM</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNum}>Ibadan</span>
                  <span className={styles.statLabel}>Samonda, First Floor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className="heading-section text-cream">Ready to Experience Dasham?</h2>
            <p className={styles.ctaSub}>
              Book your first appointment today and discover why our clients keep coming back.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/book-appointment" className="btn btn--dark btn--lg">
                Book Appointment
              </Link>
              <Link href="/services" className={`btn btn--lg ${styles.ctaViewBtn}`}>
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
