import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

function ConcernChip({ label, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startEdit = () => { setValue(label); setError(''); setEditing(true); };
  const cancel = () => { setEditing(false); setError(''); };

  const save = async () => {
    const next = value.trim();
    if (!next || next === label) { setEditing(false); return; }
    setSaving(true);
    setError('');
    try { await onRename(label, next); setEditing(false); }
    catch (e) { setError(e.message); }
    setSaving(false);
  };

  if (editing) {
    return (
      <span className="ge-fpill" style={{ background: 'var(--mint)', color: 'var(--green-d)', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 6px 4px 12px' }}>
        <input
          value={value}
          autoFocus
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
          style={{ border: '1px solid var(--line)', borderRadius: 20, padding: '3px 10px', fontSize: 13, width: 120 }}
        />
        <button onClick={save} disabled={saving} style={{ background: 0, border: 0, cursor: 'pointer', color: 'var(--green)', display: 'flex' }}><Check size={14} /></button>
        <button onClick={cancel} style={{ background: 0, border: 0, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}><X size={14} /></button>
        {error && <span style={{ color: 'var(--danger)', fontSize: 11.5, marginLeft: 4 }}>{error}</span>}
      </span>
    );
  }

  return (
    <span className="ge-fpill" style={{ background: 'var(--mint)', color: 'var(--green-d)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {label}
      <button onClick={startEdit} style={{ background: 0, border: 0, cursor: 'pointer', color: 'var(--green-d)', display: 'flex' }}><Pencil size={12} /></button>
      <button onClick={() => onDelete(label)} style={{ background: 0, border: 0, cursor: 'pointer', color: 'var(--danger)', display: 'flex' }}><Trash2 size={12} /></button>
    </span>
  );
}

export default function ConcernsManager() {
  const { concerns, addConcern, removeConcern, renameConcern } = useStore();
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
      <div className="ge-note" style={{ marginBottom: 14 }}>These appear on the homepage and in the shop filters. Renaming one automatically updates every product that uses it.</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {concerns.map(c => <ConcernChip key={c} label={c} onRename={renameConcern} onDelete={handleDelete} />)}
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
