'use client';

import { useState } from 'react';
import { whatsappUrl } from '@/lib/utils';
import styles from './page.module.css';

const WHATSAPP_MESSAGES = [
  {
    label: 'General Enquiry',
    message: 'Hello Dasham Beauty Lounge, I would like to make an enquiry.',
    phone: '08143137185',
  },
  {
    label: 'Confirm Payment',
    message: 'Hello Dasham Beauty Lounge, I just booked an appointment and I would like to confirm my payment.',
    phone: '09027714768',
  },
  {
    label: 'Custom Service Request',
    message: "Hello Dasham Beauty Lounge, I cannot find the service I want. Please assist me.",
    phone: '08143137185',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    const msg = `Hello Dasham Beauty Lounge,\n\nName: ${form.name}\nPhone: ${form.phone}\n\nMessage: ${form.message}`;
    window.open(whatsappUrl('08143137185', msg), '_blank');
    setSubmitted(true);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-label text-gold">Get in Touch</p>
          <h1 className="heading-page text-cream" style={{ marginBottom: '1rem' }}>
            Contact Us
          </h1>
          <p style={{ color: 'rgba(255,247,220,0.7)', fontSize: '1.0625rem', lineHeight: 1.75, maxWidth: '52ch' }}>
            We'd love to hear from you. Reach out via WhatsApp, social media, or the form below.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.contactLayout}>
            {/* Left: Info */}
            <div className={styles.contactInfo}>
              {/* Details */}
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Visit Us</h2>
                <div className={styles.infoItems}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <div>
                      <p className={styles.infoLabel}>Location</p>
                      <p className={styles.infoValue}>
                        Opposite Kilimanjaro, Samonda,<br />First Floor, Ibadan, Oyo State
                      </p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🕐</span>
                    <div>
                      <p className={styles.infoLabel}>Opening Hours</p>
                      <p className={styles.infoValue}>Monday – Saturday: 10:00 AM – 7:00 PM</p>
                      <p className={styles.infoNote}>Sunday: Closed</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📞</span>
                    <div>
                      <p className={styles.infoLabel}>Phone Numbers</p>
                      <a href="tel:08143137185" className={styles.infoLink}>08143137185</a>
                      <br />
                      <a href="tel:09027714768" className={styles.infoLink}>09027714768</a>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📱</span>
                    <div>
                      <p className={styles.infoLabel}>Social Media</p>
                      <a
                        href="https://instagram.com/dasham_beauty_lounge_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.infoLink}
                      >
                        @dasham_beauty_lounge_
                      </a>
                      <br />
                      <a
                        href="https://tiktok.com/@dashambeautylounge_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.infoLink}
                      >
                        @dashambeautylounge_
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Buttons */}
              <div className={styles.whatsappSection}>
                <h3 className={styles.whatsappTitle}>Quick WhatsApp Messages</h3>
                <div className={styles.whatsappButtons}>
                  {WHATSAPP_MESSAGES.map((item) => (
                    <a
                      key={item.label}
                      href={whatsappUrl(item.phone, item.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappBtn}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className={styles.mapWrapper}>
                <iframe
                  title="Dasham Beauty Lounge on Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.2!2d3.9086!3d7.4076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjQnMjcuNCJOIDPCsDU0JzMwLjkiRQ!5e0!3m2!1sen!2sng!4v1"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: Form */}
            <div className={styles.formWrapper}>
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Send a Message</h2>
                <p className={styles.formDesc}>
                  Fill in the form below and we'll get back to you via WhatsApp as soon as possible.
                </p>

                {submitted ? (
                  <div className={styles.formSuccess}>
                    <span className={styles.formSuccessIcon}>✓</span>
                    <h3>Message Sent!</h3>
                    <p>Your message has been opened in WhatsApp. We'll respond shortly.</p>
                    <button className="btn btn--secondary btn--sm" onClick={() => setSubmitted(false)}>
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">
                        Full Name <span>*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        className="form-input"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-phone">
                        Phone Number <span style={{ color: 'var(--clr-text-light)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className="form-input"
                        placeholder="e.g. 08012345678"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-message">
                        Message <span>*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        className="form-textarea"
                        placeholder="How can we help you?"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        rows={5}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn--whatsapp btn--full btn--lg">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Send via WhatsApp
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
