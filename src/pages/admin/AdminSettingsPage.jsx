import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { PAYMENTS, DEFAULT_THEME } from '../../data.js';

const THEME_FIELDS = [
  { key: 'green', label: 'Primary green' },
  { key: 'greenD', label: 'Deep green' },
  { key: 'green2', label: 'Mid green' },
  { key: 'lime', label: 'Lemon-lime accent' },
  { key: 'gold', label: 'Gold' },
  { key: 'goldD', label: 'Deep gold' },
  { key: 'bg', label: 'Page background' },
];

export default function AdminSettingsPage() {
  const { settings, updateSettings, changeAdminPin, resetStore } = useStore();
  const [form, setForm] = useState(settings);
  const [themeForm, setThemeForm] = useState(settings.theme);
  const [themeSaved, setThemeSaved] = useState(false);
  const [themeSaving, setThemeSaving] = useState(false);
  const [gridForm, setGridForm] = useState({ columns: settings.productCardColumns, bg: settings.productCardBg });
  const [gridSaved, setGridSaved] = useState(false);
  const [gridSaving, setGridSaving] = useState(false);
  const [pinForm, setPinForm] = useState({ current: '', next: '', confirm: '' });
  const [pinMsg, setPinMsg] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setThemeForm(settings.theme); }, [settings.theme]);
  useEffect(() => { setGridForm({ columns: settings.productCardColumns, bg: settings.productCardBg }); }, [settings.productCardColumns, settings.productCardBg]);

  const saveTheme = async () => {
    setThemeSaving(true);
    await updateSettings({ theme: themeForm });
    setThemeSaving(false);
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2000);
  };

  const resetTheme = () => setThemeForm(DEFAULT_THEME);

  const saveGrid = async () => {
    setGridSaving(true);
    await updateSettings({ productCardColumns: Number(gridForm.columns) || 6, productCardBg: gridForm.bg });
    setGridSaving(false);
    setGridSaved(true);
    setTimeout(() => setGridSaved(false), 2000);
  };

  const togglePayment = p => setForm(f => ({
    ...f,
    enabledPayments: f.enabledPayments.includes(p) ? f.enabledPayments.filter(x => x !== p) : [...f.enabledPayments, p],
  }));

  const saveGeneral = async () => {
    setSaving(true);
    await updateSettings({
      freeShipThreshold: Number(form.freeShipThreshold) || 0,
      shipDhaka: Number(form.shipDhaka) || 0,
      shipOutside: Number(form.shipOutside) || 0,
      enabledPayments: form.enabledPayments.length ? form.enabledPayments : settings.enabledPayments,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const changePin = async e => {
    e.preventDefault();
    if (pinForm.next.length < 4) { setPinMsg({ ok: false, text: 'New PIN must be at least 4 characters.' }); return; }
    if (pinForm.next !== pinForm.confirm) { setPinMsg({ ok: false, text: 'New PIN and confirmation do not match.' }); return; }
    const res = await changeAdminPin({ current: pinForm.current, next: pinForm.next });
    if (!res.ok) { setPinMsg({ ok: false, text: res.error }); return; }
    setPinForm({ current: '', next: '', confirm: '' });
    setPinMsg({ ok: true, text: 'Admin PIN updated.' });
  };

  const doReset = () => {
    if (window.confirm('Reset EVERYTHING to defaults? This clears all products, images, and text changes. This cannot be undone.')) resetStore();
  };

  return (
    <>
      <div className="ge-admhead">
        <div><h1>Settings</h1><p>Store-wide configuration</p></div>
      </div>

      <div className="ge-panel">
        <h3>Shipping</h3>
        <div className="ge-2col">
          <div className="ge-field"><label>Free shipping threshold (৳)</label><input type="number" value={form.freeShipThreshold} onChange={e => setForm({ ...form, freeShipThreshold: e.target.value })} /></div>
          <div className="ge-field"><label>Shipping — Dhaka (৳)</label><input type="number" value={form.shipDhaka} onChange={e => setForm({ ...form, shipDhaka: e.target.value })} /></div>
        </div>
        <div className="ge-field" style={{ maxWidth: 220 }}><label>Shipping — outside Dhaka (৳)</label><input type="number" value={form.shipOutside} onChange={e => setForm({ ...form, shipOutside: e.target.value })} /></div>

        <h3 style={{ marginTop: 22 }}>Accepted payment methods</h3>
        <div className="ge-payrow" style={{ maxWidth: 460 }}>
          {PAYMENTS.map(p => (
            <div key={p} className={'ge-pay' + (form.enabledPayments.includes(p) ? ' on' : '')} onClick={() => togglePayment(p)}>{p}</div>
          ))}
        </div>
        <div className="ge-note">Note: bKash, Nagad, and SSLCommerz require real merchant API credentials to actually process payments — until those are connected, orders using these methods are recorded for manual confirmation, same as Cash on Delivery.</div>

        <button className="ge-primary" style={{ maxWidth: 200, marginTop: 20 }} onClick={saveGeneral} disabled={saving}>{saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save changes'}</button>
      </div>

      <div className="ge-panel">
        <h3>Theme colors</h3>
        <div className="ge-note" style={{ marginBottom: 14 }}>Controls the header, footer, hero, and button gradients across the site. Changes apply instantly to everyone once saved.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
          {THEME_FIELDS.map(f => (
            <div key={f.key} className="ge-field" style={{ marginBottom: 0 }}>
              <label>{f.label}</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={themeForm[f.key]} onChange={e => setThemeForm({ ...themeForm, [f.key]: e.target.value })} style={{ width: 44, height: 38, padding: 2, flexShrink: 0 }} />
                <input value={themeForm[f.key]} onChange={e => setThemeForm({ ...themeForm, [f.key]: e.target.value })} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="ge-primary" style={{ maxWidth: 200, marginTop: 0 }} onClick={saveTheme} disabled={themeSaving}>{themeSaved ? 'Saved ✓' : themeSaving ? 'Saving…' : 'Save colors'}</button>
          <button className="ge-secondary" style={{ maxWidth: 200, marginTop: 0 }} onClick={resetTheme}>Reset to defaults</button>
        </div>
      </div>

      <div className="ge-panel">
        <h3>Product grid</h3>
        <div className="ge-note" style={{ marginBottom: 14 }}>Controls how many product boxes fit per row (on wide screens) and their background color, across the homepage, shop, and wishlist grids.</div>
        <div className="ge-2col">
          <div className="ge-field">
            <label>Products per row (desktop)</label>
            <select value={gridForm.columns} onChange={e => setGridForm({ ...gridForm, columns: e.target.value })}>
              {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="ge-field">
            <label>Product box background</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={gridForm.bg} onChange={e => setGridForm({ ...gridForm, bg: e.target.value })} style={{ width: 44, height: 38, padding: 2, flexShrink: 0 }} />
              <input value={gridForm.bg} onChange={e => setGridForm({ ...gridForm, bg: e.target.value })} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
            </div>
          </div>
        </div>
        <button className="ge-primary" style={{ maxWidth: 200, marginTop: 6 }} onClick={saveGrid} disabled={gridSaving}>{gridSaved ? 'Saved ✓' : gridSaving ? 'Saving…' : 'Save product grid'}</button>
      </div>

      <div className="ge-panel">
        <h3>Admin PIN</h3>
        {pinMsg && <div className={pinMsg.ok ? 'ge-note' : 'ge-formerr'} style={pinMsg.ok ? { color: 'var(--green-d)' } : {}}>{pinMsg.text}</div>}
        <form onSubmit={changePin}>
          <div className="ge-field"><label>Current PIN</label><input type="password" value={pinForm.current} onChange={e => setPinForm({ ...pinForm, current: e.target.value })} /></div>
          <div className="ge-2col">
            <div className="ge-field"><label>New PIN</label><input type="password" value={pinForm.next} onChange={e => setPinForm({ ...pinForm, next: e.target.value })} /></div>
            <div className="ge-field"><label>Confirm new PIN</label><input type="password" value={pinForm.confirm} onChange={e => setPinForm({ ...pinForm, confirm: e.target.value })} /></div>
          </div>
          <button className="ge-primary" style={{ maxWidth: 200 }} type="submit">Update PIN</button>
        </form>
      </div>

      <div className="ge-panel">
        <h3>Danger zone</h3>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 14 }}>Reset the entire store — products, hero, footer, and menu labels — back to the original defaults. Orders and customer accounts are not affected.</p>
        <button className="ge-tblbtn danger" onClick={doReset}>Reset store content to defaults</button>
      </div>
    </>
  );
}
