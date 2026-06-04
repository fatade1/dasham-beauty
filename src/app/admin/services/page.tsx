'use client';

import { useEffect, useState } from 'react';
import { getServices, saveService, updateService, deleteService, generateId } from '@/lib/storage';
import { Service, ServiceCategory, PricingType } from '@/lib/types';
import { formatPrice, CATEGORY_ICONS } from '@/lib/utils';
import styles from './page.module.css';

const CATEGORIES: ServiceCategory[] = [
  'Pedicure', 'Massage', 'Facials', 'Lash Extensions', 'Nails', 'Body Treatments', 'Waxing',
];
const PRICING_TYPES: PricingType[] = ['fixed', 'range', 'custom'];

const CATEGORY_IMAGES: Record<string, string> = {
  'Pedicure': '/images/services/pedicure.png',
  'Massage': '/images/services/massage.png',
  'Facials': '/images/services/facials.png',
  'Lash Extensions': '/images/services/lashes.png',
  'Nails': '/images/services/nails.png',
  'Body Treatments': '/images/services/body.png',
  'Waxing': '/images/services/waxing.png',
};

const empty = (): Partial<Service> => ({
  name: '', category: 'Nails', pricingType: 'fixed', price: 0,
  minPrice: 0, maxPrice: 0, description: '', status: 'active', depositPercent: 50,
});

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Service>>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ServiceCategory | 'All'>('All');

  const reload = () => setServices(getServices());
  useEffect(reload, []);

  const openAdd = () => { setForm(empty()); setEditId(null); setModal('add'); };
  const openEdit = (s: Service) => { setForm({ ...s }); setEditId(s.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(empty()); };

  const handleSave = () => {
    if (!form.name || !form.category) return;
    if (editId) {
      updateService(editId, form);
    } else {
      const newService: Service = {
        id: generateId(),
        name: form.name!,
        category: form.category!,
        pricingType: form.pricingType ?? 'fixed',
        price: form.price,
        minPrice: form.minPrice,
        maxPrice: form.maxPrice,
        description: form.description ?? '',
        status: form.status ?? 'active',
        depositPercent: form.depositPercent ?? 50,
        imageUrl: form.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveService(newService);
    }
    closeModal();
    reload();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this service? This cannot be undone.')) {
      deleteService(id);
      reload();
    }
  };

  const filtered = filter === 'All' ? services : services.filter((s) => s.category === filter);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Services</h1>
        <button className="btn btn--primary btn--sm" onClick={openAdd}>+ Add Service</button>
      </div>

      {/* Filter */}
      <div className={styles.filterTabs}>
        {(['All', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            className={`${styles.filterTab} ${filter === c ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(c)}
          >
            {c !== 'All' && CATEGORY_ICONS[c as ServiceCategory]} {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map((s) => (
          <div key={s.id} className={`${styles.card} ${s.status === 'inactive' ? styles.cardInactive : ''}`}>
            <div className={styles.cardImageContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.imageUrl || CATEGORY_IMAGES[s.category]}
                alt={s.name}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{CATEGORY_ICONS[s.category]}</span>
                <span className={`badge ${s.status === 'active' ? 'badge--fixed' : 'badge--custom'}`}>
                  {s.status}
                </span>
              </div>
              <h3 className={styles.cardName}>{s.name}</h3>
              <p className={styles.cardCategory}>{s.category}</p>
              <p className={styles.cardPrice}>{formatPrice(s.pricingType, s.price, s.minPrice, s.maxPrice)}</p>
              <p className={styles.cardDesc}>{s.description}</p>
              <div className={styles.cardActions}>
                <button className="btn btn--secondary btn--sm" onClick={() => openEdit(s)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(s.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{modal === 'add' ? 'Add Service' : 'Edit Service'}</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input className="form-input" value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Classic Pedicure" />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ServiceCategory }))}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pricing Type *</label>
                <select className="form-select" value={form.pricingType} onChange={(e) => setForm((f) => ({ ...f, pricingType: e.target.value as PricingType }))}>
                  {PRICING_TYPES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              {form.pricingType === 'fixed' && (
                <div className="form-group">
                  <label className="form-label">Price (₦) *</label>
                  <input type="number" className="form-input" value={form.price ?? ''} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} placeholder="e.g. 5000" />
                </div>
              )}
              {form.pricingType === 'range' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Min Price (₦) *</label>
                    <input type="number" className="form-input" value={form.minPrice ?? ''} onChange={(e) => setForm((f) => ({ ...f, minPrice: Number(e.target.value) }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Price (₦) *</label>
                    <input type="number" className="form-input" value={form.maxPrice ?? ''} onChange={(e) => setForm((f) => ({ ...f, maxPrice: Number(e.target.value) }))} />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Brief description of the service" />
              </div>
              <div className="form-group">
                <label className="form-label">Preview Image</label>
                {form.imageUrl ? (
                  <div className={styles.imagePreviewContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageUrl} alt="Service preview" className={styles.imagePreview} />
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => setForm((f) => ({ ...f, imageUrl: undefined }))}
                    >
                      Remove Custom Image
                    </button>
                  </div>
                ) : (
                  <div className={styles.imageUploadWrapper}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setForm((f) => ({ ...f, imageUrl: ev.target!.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="form-input"
                    />
                    <p className={styles.imageUploadHint}>Upload a custom photo. If empty, the default category photo will be used.</p>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Deposit % (0 = full payment)</label>
                <input type="number" className="form-input" value={form.depositPercent ?? 50} onChange={(e) => setForm((f) => ({ ...f, depositPercent: Number(e.target.value) }))} min={0} max={100} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn--secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSave}>Save Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
