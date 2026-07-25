import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function ConcernsManager() {
  const { concerns, addConcern, removeConcern } = useStore();
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    setAdding(true);
    setError('');
    try { await addConcern(newLabel.trim()); setNewLabel(''); }
    catch (e) { setError(e.message); }
    setAdding(false);
  };

  const handleDelete = async label => {
    if (!window.confirm(`Delete the "${label}" concern?`)) return;
    try { await removeConcern(label); } catch (e) { window.alert(e.message); }
  };

  return (
    <div className="ge-panel">
      <h3>Shop-by-concern chips</h3>
      <div className="ge-note" style={{ marginBottom: 14 }}>These appear on the homepage and in the shop filters. To rename one, add the new version, reassign it on any products using the old one (via Products → Edit), then delete the old one — deletion is blocked while products still reference it.</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {concerns.map(c => (
          <span key={c} className="ge-fpill" style={{ background: 'var(--mint)', color: 'var(--green-d)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {c}
            <button onClick={() => handleDelete(c)} style={{ background: 0, border: 0, cursor: 'pointer', color: 'var(--danger)', display: 'flex' }}><Trash2 size={12} /></button>
          </span>
        ))}
        {concerns.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 13.5 }}>No concerns yet.</span>}
      </div>

      {error && <div className="ge-formerr">{error}</div>}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div className="ge-field" style={{ marginBottom: 0, maxWidth: 280, flex: 1 }}>
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Dandruff" />
        </div>
        <button className="ge-tblbtn" style={{ padding: '11px 16px' }} disabled={!newLabel.trim() || adding} onClick={handleAdd}><Plus size={12} /> {adding ? 'Adding…' : 'Add'}</button>
      </div>
    </div>
  );
}
