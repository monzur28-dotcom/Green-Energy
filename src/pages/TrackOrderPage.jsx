import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function TrackOrderPage() {
  const { findOrder } = useStore();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const order = await findOrder(orderId, phone);
    setSubmitting(false);
    if (!order) { setError('No order found with that ID and phone number. Please double-check and try again.'); return; }
    navigate(`/order/${order.id}`);
  };

  return (
    <div className="ge-wrap narrow">
      <div className="ge-authbox">
        <h1>Track your order</h1>
        <p className="sub">Enter your order ID and the phone number used at checkout.</p>
        {error && <div className="ge-formerr">{error}</div>}
        <form onSubmit={submit}>
          <div className="ge-field"><label>Order ID</label><input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="e.g. GE-482913" required /></div>
          <div className="ge-field"><label>Phone number</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required /></div>
          <button className="ge-primary" type="submit" disabled={submitting}><Search size={15} style={{ verticalAlign: -3, marginRight: 6 }} />{submitting ? 'Searching…' : 'Track order'}</button>
        </form>
      </div>
    </div>
  );
}
