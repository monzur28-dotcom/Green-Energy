import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { PAYMENTS } from '../../data.js';

export default function AdminSettingsPage() {
  const { settings, updateSettings, changeAdminPin, resetStore } = useStore();
  const [form, setForm] = useState(settings);
  const [pinForm, setPinForm] = useState({ current: '', next: '', confirm: '' });
  const [pinMsg, setPinMsg] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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
