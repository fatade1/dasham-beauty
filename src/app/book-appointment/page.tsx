'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getServices, getSiteSettings, getAvailability, generateTimeSlots, saveBooking, generateId } from '@/lib/storage';
import { formatNaira, formatPrice, calculateDeposit, whatsappUrl, formatTime, CATEGORY_ICONS } from '@/lib/utils';
import { Service, ServiceCategory, Booking, PricingType, SiteSettings } from '@/lib/types';
import styles from './page.module.css';

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Payment'];

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ time: string; label: string }[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [workingDays, setWorkingDays] = useState<number[]>([1,2,3,4,5,6]);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    category: '' as ServiceCategory | '',
    serviceId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
    transactionRef: '',
    nameUsedForTransfer: '',
    paymentProof: null as string | null,
    paymentProofName: '',
    agreedToTerms: false,
  });

  const [settings, setSettings] = useState<SiteSettings>({
    bankName: 'Access Bank',
    accountName: 'Dasham Beauty Lounge',
    accountNumber: '0000000000',
    whatsappNumber: '08143137185',
    whatsappNumber2: '09027714768',
    instagramHandle: 'dasham_beauty_lounge_',
    tiktokHandle: 'dashambeautylounge_',
    adminPasswordHash: 'dasham2024',
  });

  useEffect(() => {
    async function loadData() {
      const siteSettings = await getSiteSettings();
      setSettings(siteSettings);

      const allServices = await getServices();
      const activeServices = allServices.filter((s) => s.status === 'active');
      setServices(activeServices);

      const avail = await getAvailability();
      setWorkingDays(avail.workingDays);
      setBlockedDates(avail.blockedDates);
      setTimeSlots(generateTimeSlots(avail.openTime, avail.closeTime, avail.slotDurationMinutes));

      // Generate next 60 days of available dates
      const dates: string[] = [];
      const now = new Date();
      for (let i = 1; i <= 60; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        const dayOfWeek = d.getDay();
        const iso = d.toISOString().split('T')[0];
        if (avail.workingDays.includes(dayOfWeek) && !avail.blockedDates.includes(iso)) {
          dates.push(iso);
        }
      }
      setAvailableDates(dates);

      // Pre-fill service from query param
      const serviceId = searchParams.get('service');
      if (serviceId) {
        const s = activeServices.find((sv) => sv.id === serviceId);
        if (s) {
          setSelectedServices([s]);
          setSelectedCategory(s.category);
          setForm((f) => ({ ...f, serviceId: s.id, category: s.category }));
          setStep(1);
        }
      }
    }
    loadData();
  }, [searchParams]);

  useEffect(() => {
    if (services.length > 0 && !selectedCategory) {
      setSelectedCategory(services[0].category);
    }
  }, [services, selectedCategory]);

  useEffect(() => {
    const ids = selectedServices.map((s) => s.id).join(',');
    setForm((f) => ({ ...f, serviceId: ids }));
    if (ids) {
      setErrors((e) => {
        const copy = { ...e };
        delete copy.serviceId;
        return copy;
      });
    }
  }, [selectedServices]);

  const categories = Array.from(new Set(services.map((s) => s.category)));
  const categoryServices = services.filter((s) => s.category === selectedCategory);

  const setField = (key: string, value: unknown) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const copy = {...e}; delete copy[key]; return copy; });
  };

  const toggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, paymentProof: 'File must be under 5MB' }));
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setErrors((e) => ({ ...e, paymentProof: 'Only JPG, PNG, or PDF allowed' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setField('paymentProof', ev.target?.result as string);
      setField('paymentProofName', file.name);
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 0) {
      if (selectedServices.length === 0) newErrors.serviceId = 'Please select at least one service';
    }
    if (s === 1) {
      if (!form.date) newErrors.date = 'Please select a date';
      if (!form.time) newErrors.time = 'Please select a time';
    }
    if (s === 2) {
      if (!form.name.trim()) newErrors.name = 'Please enter your name';
      if (!form.phone.trim()) newErrors.phone = 'Please enter your phone number';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }
    if (s === 3) {
      if (!form.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the Terms & Conditions';
      if (!form.paymentProof && !form.transactionRef.trim()) {
        newErrors.payment = 'Please upload payment proof or enter a transaction reference';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const totalAmount = selectedServices.reduce((sum, s) => {
    if (s.pricingType === 'fixed') return sum + (s.price ?? 0);
    if (s.pricingType === 'range') return sum + (s.minPrice ?? 0);
    return sum;
  }, 0);

  const payAmount = selectedServices.reduce((sum, s) => {
    const base = s.pricingType === 'fixed' ? (s.price ?? 0) : s.pricingType === 'range' ? (s.minPrice ?? 0) : 0;
    return sum + calculateDeposit(base, s.depositPercent);
  }, 0);

  const bookingPricingType: PricingType = selectedServices.some(s => s.pricingType === 'range')
    ? 'range'
    : selectedServices.some(s => s.pricingType === 'fixed')
    ? 'fixed'
    : 'custom';

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setSubmitting(true);

    const id = generateId();
    const joinedIds = selectedServices.map((s) => s.id).join(',');
    const joinedNames = selectedServices.map((s) => s.name).join(' + ');
    const joinedCategories = Array.from(new Set(selectedServices.map((s) => s.category))).join(', ');

    const booking: Booking = {
      id,
      customerName: form.name,
      phone: form.phone,
      email: form.email,
      serviceId: joinedIds,
      serviceName: joinedNames,
      serviceCategory: joinedCategories as ServiceCategory,
      preferredDate: form.date,
      preferredTime: form.time,
      notes: form.notes,
      totalAmount: totalAmount,
      depositAmount: payAmount,
      pricingType: bookingPricingType,
      paymentStatus: form.paymentProof || form.transactionRef ? 'awaiting_confirmation' : 'not_paid',
      bookingStatus: form.paymentProof || form.transactionRef ? 'payment_submitted' : 'pending_payment',
      paymentProof: form.paymentProof ?? undefined,
      paymentProofName: form.paymentProofName || undefined,
      transactionReference: form.transactionRef || undefined,
      nameUsedForTransfer: form.nameUsedForTransfer || undefined,
      agreedToTerms: true,
      selectedServices: selectedServices.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        price: s.pricingType === 'fixed' ? (s.price ?? 0) : s.pricingType === 'range' ? (s.minPrice ?? 0) : 0,
        pricingType: s.pricingType,
        depositPercent: s.depositPercent,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveBooking(booking);

    // Send background email notification to admin (fails silently for client)
    try {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      }).catch((err) => console.error('Error sending email notification:', err));
    } catch (e) {
      console.error(e);
    }

    setBookingId(id);
    setSubmitting(false);
    setSubmitted(true);
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(settings.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmUrl = whatsappUrl(
    '08143137185',
    `Hello Dasham Beauty Lounge, I just booked an appointment (ID: ${bookingId}) for ${selectedServices.map(s => s.name).join(', ')} and I would like to confirm my payment.`
  );

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Booking Submitted!</h2>
          <p className={styles.successDesc}>
            Thank you, <strong>{form.name}</strong>. Your appointment request for{' '}
            <strong>{selectedServices.map(s => s.name).join(' + ')}</strong> on{' '}
            <strong>{form.date}</strong> at <strong>{formatTime(form.time)}</strong> has been received.
          </p>
          <p className={styles.successNote}>
            We'll verify your payment and confirm your booking shortly.
            You may also follow up via WhatsApp to speed things up.
          </p>
          <div className={styles.successRef}>
            Booking Ref: <strong>{bookingId.toUpperCase()}</strong>
          </div>
          <div className={styles.successActions}>
            <a href={confirmUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirm Payment on WhatsApp
          </a>
          <button onClick={() => router.push('/')} className="btn btn--secondary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className={styles.bookingLayout}>
      {/* Form Column */}
      <div className={styles.formColumn}>
        {/* Progress */}
        <div className={styles.progress}>
          {STEPS.map((label, i) => (
            <div key={label} className={`${styles.progressStep} ${i <= step ? styles.progressStepActive : ''} ${i < step ? styles.progressStepDone : ''}`}>
              <div className={styles.progressDot}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={styles.progressLabel}>{label}</span>
              {i < STEPS.length - 1 && <div className={styles.progressLine} />}
            </div>
          ))}
        </div>

        {/* Step 0 — Service Selection */}
        {step === 0 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Select Services</h2>

            <div className="form-group">
              <label className="form-label">Service Category <span>*</span></label>
              <div className={styles.categoryTabs}>
                {categories.map((c) => {
                  const isActive = selectedCategory === c;
                  const icon = CATEGORY_ICONS[c] || '✨';
                  return (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ''}`}
                      onClick={() => setSelectedCategory(c)}
                    >
                      <span className={styles.categoryTabIcon}>{icon}</span>
                      <span className={styles.categoryTabLabel}>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedCategory && (
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <div className={styles.servicesHeader}>
                  <label className="form-label">Choose Services <span>*</span></label>
                  <span className={styles.servicesCountHint}>You can select multiple services</span>
                </div>
                <div className={styles.serviceOptions}>
                  {categoryServices.map((s) => {
                    const isSelected = selectedServices.some((sv) => sv.id === s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`${styles.serviceOption} ${isSelected ? styles.serviceOptionSelected : ''}`}
                        onClick={() => toggleService(s)}
                      >
                        <div className={styles.serviceOptionTop}>
                          <div className={styles.serviceOptionNameWrapper}>
                            <span className={`${styles.serviceOptionCheckbox} ${isSelected ? styles.serviceOptionCheckboxActive : ''}`}>
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className={styles.serviceOptionName}>{s.name}</span>
                          </div>
                          <span className={`badge ${s.pricingType === 'fixed' ? 'badge--fixed' : s.pricingType === 'range' ? 'badge--range' : 'badge--custom'}`}>
                            {s.pricingType === 'fixed' ? 'Fixed' : s.pricingType === 'range' ? 'Range' : 'Custom'}
                          </span>
                        </div>
                        <p className={styles.serviceOptionDesc}>{s.description}</p>
                        <div className={styles.serviceOptionPriceWrapper}>
                          <span className={styles.serviceOptionPrice}>
                            {formatPrice(s.pricingType, s.price, s.minPrice, s.maxPrice)}
                          </span>
                          {isSelected && <span className={styles.serviceOptionSelectedTag}>Added</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.serviceId && <p className="form-error">{errors.serviceId}</p>}
              </div>
            )}

            {selectedServices.length > 0 && (
              <div className={styles.cartBanner}>
                <div className={styles.cartBannerInfo}>
                  <span className={styles.cartBannerCount}>
                    {selectedServices.length} {selectedServices.length === 1 ? 'service' : 'services'} selected
                  </span>
                  <span className={styles.cartBannerTotal}>
                    Total: {formatNaira(totalAmount)}
                  </span>
                </div>
                <button type="button" className="btn btn--primary btn--sm" onClick={nextStep}>
                  Continue to Date & Time →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 1 — Date & Time */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Choose Date & Time</h2>
            <div className="form-group">
              <label className="form-label">Preferred Date <span>*</span></label>
              <select
                className={`form-select ${errors.date ? 'error' : ''}`}
                value={form.date}
                onChange={(e) => setField('date', e.target.value)}
              >
                <option value="">Select a date…</option>
                {availableDates.map((d) => {
                  const date = new Date(d);
                  const label = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                  return <option key={d} value={d}>{label}</option>;
                })}
              </select>
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Time <span>*</span></label>
              <div className={styles.timeSlots}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    className={`${styles.timeSlot} ${form.time === slot.time ? styles.timeSlotSelected : ''}`}
                    onClick={() => setField('time', slot.time)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              {errors.time && <p className="form-error">{errors.time}</p>}
            </div>
          </div>
        )}

        {/* Step 2 — Personal Details */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Your Details</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name <span>*</span></label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Amara Okonkwo"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                autoComplete="name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number <span>*</span></label>
              <input
                id="phone"
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="e.g. 08012345678"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                autoComplete="tel"
                inputMode="tel"
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address <span style={{ color: 'var(--clr-text-light)', fontWeight: 400 }}>(optional)</span></label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="e.g. amara@example.com"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="notes">Special Request / Notes <span style={{ color: 'var(--clr-text-light)', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                id="notes"
                className="form-textarea"
                placeholder="Any specific requirements, allergies, or preferences…"
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3 — Payment */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Payment Details</h2>

            {/* Payment Instruction Card */}
            <div className={styles.paymentCard}>
              <div className={styles.paymentCardHeader}>
                <span className={styles.paymentCardTitle}>Payment Instruction</span>
                <span className={styles.paymentCardBadge}>
                  {bookingPricingType === 'fixed' ? 'Full Payment' : 'Combined Deposit'}
                </span>
              </div>
              <p className={styles.paymentCardNote}>
                Please make your payment using the account details below, then upload your payment proof to complete your booking request. Your appointment will be confirmed after payment verification.
              </p>

              {/* Itemized Payment Breakdown */}
              <div className={styles.paymentBreakdown}>
                <h4 className={styles.paymentBreakdownTitle}>Selected Services & Deposit</h4>
                <div className={styles.paymentBreakdownList}>
                  {selectedServices.map((s) => {
                    const priceVal = s.pricingType === 'fixed' ? (s.price ?? 0) : s.pricingType === 'range' ? (s.minPrice ?? 0) : 0;
                    const depVal = calculateDeposit(priceVal, s.depositPercent);
                    return (
                      <div key={s.id} className={styles.paymentBreakdownRow}>
                        <div className={styles.paymentBreakdownNameCol}>
                          <span className={styles.paymentBreakdownName}>{s.name}</span>
                          <span className={styles.paymentBreakdownType}>
                            {s.pricingType === 'fixed' ? 'Fixed Price' : s.pricingType === 'range' ? 'Min Price (Range)' : 'Consultation'}
                          </span>
                        </div>
                        <div className={styles.paymentBreakdownPriceCol}>
                          <span className={styles.paymentBreakdownPrice}>
                            {formatPrice(s.pricingType, s.price, s.minPrice, s.maxPrice)}
                          </span>
                          <span className={styles.paymentBreakdownDeposit}>
                            {depVal > 0 ? `Deposit (${s.depositPercent}%): ${formatNaira(depVal)}` : 'No deposit'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.paymentAmount}>
                <span className={styles.paymentAmountLabel}>Total Deposit to Pay</span>
                <span className={styles.paymentAmountValue}>
                  {payAmount > 0 ? formatNaira(payAmount) : 'To be confirmed at lounge'}
                </span>
                {selectedServices.some(s => s.pricingType === 'range') && (
                  <span className={styles.paymentAmountNote}>Based on minimum price of range services. Final amount confirmed at lounge.</span>
                )}
              </div>

              <div className={styles.bankDetails}>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>Bank</span>
                  <span className={styles.bankValue}>{settings.bankName}</span>
                </div>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>Account Name</span>
                  <span className={styles.bankValue}>{settings.accountName}</span>
                </div>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>Account Number</span>
                  <span className={styles.bankValue}>
                    {settings.accountNumber}
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={copyAccountNumber}
                      aria-label="Copy account number"
                    >
                      {copied ? '✓ Copied' : '⎘ Copy'}
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Proof */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Upload Payment Proof</label>
              <label className={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className={styles.uploadInput}
                  onChange={handleFileUpload}
                />
                <div className={styles.uploadContent}>
                  {form.paymentProof ? (
                    <>
                      <span className={styles.uploadIcon}>✓</span>
                      <span className={styles.uploadText}>{form.paymentProofName}</span>
                      <span className={styles.uploadHint}>Click to replace</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>↑</span>
                      <span className={styles.uploadText}>Click to upload</span>
                      <span className={styles.uploadHint}>JPG, PNG, or PDF • Max 5MB</span>
                    </>
                  )}
                </div>
              </label>
              {errors.paymentProof && <p className="form-error">{errors.paymentProof}</p>}
            </div>

            <div style={{ textAlign: 'center', color: 'var(--clr-text-light)', margin: '0.75rem 0', fontSize: '0.875rem' }}>
              — or —
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="transRef">Transaction Reference</label>
              <input
                id="transRef"
                type="text"
                className="form-input"
                placeholder="e.g. FBN2024060300123"
                value={form.transactionRef}
                onChange={(e) => setField('transactionRef', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="transferName">Name Used for Transfer</label>
              <input
                id="transferName"
                type="text"
                className="form-input"
                placeholder="Name on the transfer receipt"
                value={form.nameUsedForTransfer}
                onChange={(e) => setField('nameUsedForTransfer', e.target.value)}
              />
            </div>

            {errors.payment && <p className="form-error" style={{ marginTop: '-0.5rem' }}>{errors.payment}</p>}

            {/* T&C Checkbox */}
            <label className={styles.termsCheck}>
              <input
                type="checkbox"
                checked={form.agreedToTerms}
                onChange={(e) => setField('agreedToTerms', e.target.checked)}
                className={styles.termsCheckInput}
              />
              <span className={styles.termsCheckLabel}>
                I agree to Dasham Beauty Lounge's{' '}
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>
                , including payment, cancellation, lateness, and refund policies.
              </span>
            </label>
            {errors.agreedToTerms && <p className="form-error">{errors.agreedToTerms}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className={styles.stepNav}>
          {step > 0 && (
            <button type="button" className="btn btn--secondary" onClick={prevStep}>
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn--primary" onClick={nextStep} style={{ marginLeft: 'auto' }}>
              Continue →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ marginLeft: 'auto' }}
            >
              {submitting ? 'Submitting…' : 'Submit Booking'}
            </button>
          )}
        </div>
      </div>

      {/* Summary Column */}
      <div className={styles.summaryColumn}>
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Booking Summary</h3>
          <div className={styles.summaryItems}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Services Selected</span>
              <span className={styles.summaryValue}>
                {selectedServices.length > 0 ? (
                  <div className={styles.summaryCartList}>
                    {selectedServices.map((s) => (
                      <div key={s.id} className={styles.summaryCartItem}>
                        <span className={styles.summaryCartItemName}>{s.name}</span>
                        <span className={styles.summaryCartItemPrice}>
                          {formatPrice(s.pricingType, s.price, s.minPrice, s.maxPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={styles.summaryEmpty}>None selected</span>
                )}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Date</span>
              <span className={styles.summaryValue}>
                {form.date ? new Date(form.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : <span className={styles.summaryEmpty}>Not selected</span>}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Time</span>
              <span className={styles.summaryValue}>
                {form.time ? formatTime(form.time) : <span className={styles.summaryEmpty}>Not selected</span>}
              </span>
            </div>
            {form.name && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Name</span>
                <span className={styles.summaryValue}>{form.name}</span>
              </div>
            )}
          </div>
          {selectedServices.length > 0 && (
            <div className={styles.summaryPriceBox}>
              <div className={styles.summaryPriceRow}>
                <span>Subtotal</span>
                <span>{formatNaira(totalAmount)}</span>
              </div>
              {payAmount > 0 && (
                <div className={`${styles.summaryPriceRow} ${styles.summaryPriceRowTotal}`}>
                  <span>Total Deposit</span>
                  <span>{formatNaira(payAmount)}</span>
                </div>
              )}
            </div>
          )}
          {selectedServices.length === 0 && (
            <p className={styles.summaryPlaceholder}>
              Select one or more services to see your booking summary.
            </p>
          )}
        </div>

        <div className={styles.helpCard}>
          <p className={styles.helpTitle}>Need Help?</p>
          <a
            href={whatsappUrl('08143137185', 'Hello Dasham Beauty Lounge, I need help booking an appointment.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp btn--sm btn--full"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-label text-gold">Secure Your Spot</p>
          <h1 className="heading-page text-cream" style={{ marginBottom: '1rem' }}>
            Book an Appointment
          </h1>
          <p style={{ color: 'rgba(255,247,220,0.7)', fontSize: '1.0625rem', lineHeight: 1.75, maxWidth: '54ch' }}>
            Select your service, choose your preferred time, and secure your appointment with a deposit or full payment.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--clr-text-muted)' }}>Loading booking form…</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
