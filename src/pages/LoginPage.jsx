import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';

export default function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(form);
    setSubmitting(false);
    if (!res.ok) { setError(res.error); return; }
    navigate(location.state?.from?.pathname || '/account');
  };

  return (
    <div className="ge-wrap narrow">
      <div className="ge-authbox">
        <h1>Welcome back</h1>
        <p className="sub">Sign in to view your orders and manage your account.</p>
        {error && <div className="ge-formerr">{error}</div>}
        <form onSubmit={submit}>
          <div className="ge-field"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></div>
          <div className="ge-field"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required /></div>
          <button className="ge-primary" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div className="ge-authswitch">Don't have an account? <Link to="/register">Create one</Link></div>
      </div>
    </div>
  );
}
