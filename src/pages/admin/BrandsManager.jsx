import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

function BrandRow({ brand, index, onSave, onDelete }) {
  const [name, setName] = useState(brand.name);
  const [off, setOff] = useState(brand.off);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = name !== brand.name || off !== brand.off;

  const save = async () => {
    setSaving(true);
    try { await onSave(index, { name: name.trim() || brand.name, off }); setSaved(true); setTimeout(() => setSaved(false), 1500); }
    catch (e) { window.alert(e.message); }
    setSaving(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Brand name" />
      <input value={off} onChange={e => setOff(e.target.value)} placeholder="e.g. up to 40% off" />
      <button className="ge-tblbtn" disabled={!dirty || saving} onClick={save}><Save size={12} /> {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save'}</button>
      <button className="ge-tblbtn danger" onClick={() => onDelete(index)}><Trash2 size={12} /></button>
    </div>
  );
}

export default function BrandsManager() {
  const { brands, addBrand, editBrand, removeBrand } = useStore();
  const [newName, setNewName] = useState('');
  const [newOff, setNewOff] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    try { await addBrand({ name: newName.trim(), off: newOff.trim() }); setNewName(''); setNewOff(''); }
    catch (e) { setError(e.message); }
    setAdding(false);
  };

  const handleDelete = async index => {
    if (!window.confirm('Remove this brand from the homepage strip?')) return;
    try { await removeBrand(index); } catch (e) { window.alert(e.message); }
  };

  return (
    <div className="ge-panel">
      <h3>Top brands (homepage strip)</h3>
      <div className="ge-note" style={{ marginBottom: 14 }}>Purely a marketing display — this list is independent from your actual product brands, so editing it never affects the shop's brand filters.</div>

      <div className="ge-tablewrap">
        <div style={{ minWidth: 520 }}>
          {brands.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)', paddingBottom: 8, borderBottom: '2px solid var(--line)' }}>
              <span>Name</span><span>Discount text</span><span></span><span></span>
            </div>
          )}
          {brands.map((b, i) => <BrandRow key={i} brand={b} index={i} onSave={editBrand} onDelete={handleDelete} />)}
        </div>
      </div>
      {brands.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No brands yet — add your first one below.</p>}

      {error && <div className="ge-formerr" style={{ marginTop: 14 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Brand name" />
        <input value={newOff} onChange={e => setNewOff(e.target.value)} placeholder="e.g. up to 40% off" />
        <button className="ge-tblbtn" disabled={!newName.trim() || adding} onClick={handleAdd}><Plus size={12} /> {adding ? 'Adding…' : 'Add'}</button>
      </div>
    </div>
  );
}
