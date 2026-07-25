import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, Leaf } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function AdminLoginPage() {
  const { adminSession, adminLogin } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  if (adminSession) return <Navigate to="/admin" replace />;

  const [submitting, setSubmitting] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await adminLogin(pin);
    setSubmitting(false);
    if (ok) navigate('/admin');
    else setError(true);
  };

  return (
    <div className="ge-wrap narrow">
      <div className="ge-authbox" style={{ textAlign: 'center' }}>
        <div className="ge-okic" style={{ margin: '0 auto 16px' }}><Leaf size={30} /></div>
        <h1>Admin sign in</h1>
        <p className="sub">Enter your admin PIN to access the dashboard.</p>
        {error && <div className="ge-formerr">Wrong PIN. Try again.</div>}
        <form onSubmit={submit}>
          <div className="ge-field">
            <input type="password" autoFocus value={pin} onChange={e => { setPin(e.target.value); setError(false); }} placeholder="••••" style={{ textAlign: 'center', fontSize: 20, letterSpacing: 4 }} />
          </div>
          <button className="ge-primary" type="submit" disabled={submitting}><ShieldCheck size={15} style={{ verticalAlign: -3, marginRight: 6 }} />{submitting ? 'Checking…' : 'Unlock admin'}</button>
        </form>
      </div>
    </div>
  );
}
