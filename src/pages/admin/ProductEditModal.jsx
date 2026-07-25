import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function ProductEditModal({ product, isNew, saving, onClose, onSave }) {
  const { categories, CAT } = useStore();
  const [p, setP] = useState(product);
  const ec = CAT[p.cat] || CAT.all;

  const update = patch => setP(prev => ({ ...prev, ...patch }));

  return (
    <div className="ge-scrim center" onClick={onClose}>
      <div className="ge-modal" onClick={e => e.stopPropagation()}>
        <div className="ge-mhead"><h3>{isNew ? 'Add product' : 'Edit product'}</h3><button className="ge-x" onClick={onClose}><X size={18} /></button></div>
        <div className="ge-mbody">
          <div className="ge-qtile" style={{ background: p.image ? '#fff' : ec.tint, aspectRatio: '3' }}>
            {p.image ? <img src={p.image} alt="" className="ge-pimg" /> : (() => { const I = ec.Icon; return <I size={60} color={ec.fg} strokeWidth={1.3} />; })()}
          </div>
          <div className="ge-2col">
            <div className="ge-field"><label>Product name</label><input value={p.name} onChange={e => update({ name: e.target.value })} /></div>
            <div className="ge-field"><label>Brand</label><input value={p.brand} onChange={e => update({ brand: e.target.value })} placeholder="e.g. Lafz" /></div>
          </div>
          <div className="ge-2col">
            <div className="ge-field"><label>Category</label>
              <select value={p.cat} onChange={e => update({ cat: e.target.value, sub: '' })}>
                {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="ge-field"><label>Subcategory</label>
              <select value={p.sub || ''} onChange={e => update({ sub: e.target.value })}>
                <option value="">— none —</option>
                {(CAT[p.cat]?.subs || []).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="ge-2col">
            <div className="ge-field"><label>Price (৳)</label><input type="number" value={p.price} onChange={e => update({ price: e.target.value })} /></div>
            <div className="ge-field"><label>Compare-at price (৳)</label><input type="number" value={p.mrp} onChange={e => update({ mrp: e.target.value })} placeholder="optional" /></div>
          </div>
          <div className="ge-2col">
            <div className="ge-field"><label>Badge / tag</label>
              <select value={p.tag || ''} onChange={e => update({ tag: e.target.value })}>
                <option value="">— none —</option>
                {['Bestseller', 'Hot', 'Combo', 'Buy 1 Get 1', 'New'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="ge-field"><label>Rating</label><input type="number" step="0.1" min="0" max="5" value={p.rating} onChange={e => update({ rating: e.target.value })} /></div>
          </div>
          <div className="ge-field"><label>Stock quantity</label><input type="number" min="0" value={p.stock ?? 100} onChange={e => update({ stock: e.target.value })} /></div>
          <div className="ge-field">
            <label>Photo</label>
            <input value={p.image || ''} onChange={e => update({ image: e.target.value })} placeholder="Paste an image URL…" />
            <div className="ge-editrow">
              <label className="ge-upload"><Upload size={13} /> Upload from device
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => update({ image: r.result }); r.readAsDataURL(f); }} />
              </label>
              {p.image && <button className="ge-clear" onClick={() => update({ image: '' })}>Remove photo</button>}
            </div>
            <div className="ge-note">Tip: pasting a URL is most reliable. Uploaded photos are stored in this browser only.</div>
          </div>
          <label className="ge-check"><input type="checkbox" checked={!!p.sold} onChange={e => update({ sold: e.target.checked })} /> Mark as sold out</label>
          <button className="ge-primary" disabled={saving} onClick={() => onSave({ ...p, price: Number(p.price) || 0, mrp: Number(p.mrp) || Number(p.price) || 0, rating: Number(p.rating) || 0, reviews: Number(p.reviews) || 0, stock: Number(p.stock) || 0 })}>
            {saving ? 'Saving…' : isNew ? 'Add to store' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
