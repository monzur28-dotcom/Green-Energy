import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { taka, blankProduct } from '../../data.js';
import ProductEditModal from './ProductEditModal.jsx';

export default function AdminProductsPage() {
  const { products, upsertProduct, removeProduct, CAT } = useStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => products.filter(p => (p.name + ' ' + p.brand).toLowerCase().includes(query.toLowerCase())), [products, query]);

  const [saving, setSaving] = useState(false);
  const openNew = () => { setEditing(blankProduct()); setIsNew(true); };
  const openEdit = p => { setEditing(p); setIsNew(false); };
  const save = async p => {
    setSaving(true);
    try { await upsertProduct(p); setEditing(null); }
    catch (e) { window.alert(e.message); }
    setSaving(false);
  };
  const del = async p => {
    if (!window.confirm(`Remove "${p.name}" from the store?`)) return;
    try { await removeProduct(p.id); } catch (e) { window.alert(e.message); }
  };

  return (
    <>
      <div className="ge-admhead">
        <div><h1>Products</h1><p>{products.length} products in catalog</p></div>
        <button className="ge-tblbtn" style={{ padding: '10px 16px', fontSize: 13.5 }} onClick={openNew}><Plus size={14} /> Add product</button>
      </div>

      <div className="ge-panel">
        <div className="ge-admtoolbar">
          <div className="ge-admsearch"><Search size={15} color="#6d766c" /><input placeholder="Search products or brands…" value={query} onChange={e => setQuery(e.target.value)} /></div>
        </div>
        <div className="ge-tablewrap">
          <table className="ge-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const c = CAT[p.cat] || CAT.all;
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="prodcell">
                        <div className="prodthumb" style={{ background: p.image ? '#fff' : c.tint }}>
                          {p.image ? <img src={p.image} alt="" className="ge-pimg" /> : <c.Icon size={18} color={c.fg} />}
                        </div>
                        <div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.brand}</div></div>
                      </div>
                    </td>
                    <td>{c.name}{p.sub ? ` · ${p.sub}` : ''}</td>
                    <td>{taka(p.price)}</td>
                    <td>{p.stock ?? '—'}</td>
                    <td>{p.sold ? <span className="ge-statuspill Cancelled">Sold out</span> : (p.stock <= 5 ? <span className="ge-statuspill Pending">Low stock</span> : <span className="ge-statuspill Delivered">In stock</span>)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="ge-tblbtn" onClick={() => openEdit(p)}><Pencil size={12} /> Edit</button>
                        <button className="ge-tblbtn danger" onClick={() => del(p)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>No products match your search.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <ProductEditModal product={editing} isNew={isNew} saving={saving} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}
