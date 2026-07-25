import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';

export default function RegisterPage() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 4) { setError('Password must be at least 4 characters.'); return; }
    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);
    if (!res.ok) { setError(res.error); return; }
    navigate('/account');
  };

  return (
    <div className="ge-wrap narrow">
      <div className="ge-authbox">
        <h1>Create your account</h1>
        <p className="sub">Save your details for faster checkout and order tracking.</p>
        {error && <div className="ge-formerr">{error}</div>}
        <form onSubmit={submit}>
          <div className="ge-field"><label>Full name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Monzur Ahmed" required /></div>
          <div className="ge-field"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></div>
          <div className="ge-field"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" required /></div>
          <div className="ge-field"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 4 characters" required /></div>
          <button className="ge-primary" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
        </form>
        <div className="ge-authswitch">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
