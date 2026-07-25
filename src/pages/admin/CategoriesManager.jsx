import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { ICON_KEYS, iconFor } from '../../icons.js';

function CategoryRow({ category, onSave, onDelete }) {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const [subsText, setSubsText] = useState((category.subs || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const Icon = iconFor(icon);

  const dirty = name !== category.name || icon !== category.icon || subsText !== (category.subs || []).join(', ');

  const save = async () => {
    setSaving(true);
    const subs = subsText.split(',').map(s => s.trim()).filter(Boolean);
    try {
      await onSave(category.id, { name: name.trim() || category.name, icon, subs });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) { window.alert(e.message); }
    setSaving(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 140px 1fr auto auto', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: category.tint, color: category.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={17} />
      </div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" />
      <select value={icon} onChange={e => setIcon(e.target.value)}>
        {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
      </select>
      <input value={subsText} onChange={e => setSubsText(e.target.value)} placeholder="Subcategories, comma separated" />
      <button className="ge-tblbtn" disabled={!dirty || saving} onClick={save}><Save size={12} /> {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save'}</button>
      <button className="ge-tblbtn danger" onClick={() => onDelete(category)}><Trash2 size={12} /></button>
    </div>
  );
}

export default function CategoriesManager() {
  const { categories, addCategory, editCategory, removeCategory } = useStore();
  const list = categories.filter(c => c.id !== 'all');

  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState(ICON_KEYS[0]);
  const [newSubs, setNewSubs] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async c => {
    if (!window.confirm(`Delete the "${c.name}" category?`)) return;
    try { await removeCategory(c.id); }
    catch (e) { window.alert(e.message); }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    try {
      await addCategory({ name: newName.trim(), icon: newIcon, subs: newSubs.split(',').map(s => s.trim()).filter(Boolean) });
      setNewName(''); setNewSubs(''); setNewIcon(ICON_KEYS[0]);
    } catch (e) { setError(e.message); }
    setAdding(false);
  };

  return (
    <div className="ge-panel">
      <h3>Categories</h3>
      <div className="ge-note" style={{ marginBottom: 14 }}>These appear in the header nav, shop filters, and footer. Deleting a category is blocked while products still use it — reassign or delete those products first.</div>

      <div className="ge-tablewrap">
        <div style={{ minWidth: 720 }}>
          {list.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 140px 1fr auto auto', gap: 10, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)', paddingBottom: 8, borderBottom: '2px solid var(--line)' }}>
              <span></span><span>Name</span><span>Icon</span><span>Subcategories</span><span></span><span></span>
            </div>
          )}
          {list.map(c => <CategoryRow key={c.id} category={c} onSave={editCategory} onDelete={handleDelete} />)}
        </div>
      </div>
      {list.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No categories yet — add your first one below.</p>}

      <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
        <h3 style={{ marginBottom: 12 }}>Add category</h3>
        {error && <div className="ge-formerr">{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 1fr auto', gap: 10, alignItems: 'center' }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Home & Living" />
          <select value={newIcon} onChange={e => setNewIcon(e.target.value)}>
            {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <input value={newSubs} onChange={e => setNewSubs(e.target.value)} placeholder="Subcategories, comma separated (optional)" />
          <button className="ge-tblbtn" disabled={!newName.trim() || adding} onClick={handleAdd}><Plus size={12} /> {adding ? 'Adding…' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
