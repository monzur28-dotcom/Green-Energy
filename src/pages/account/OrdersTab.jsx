import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { taka } from '../../data.js';

export default function OrdersTab() {
  const { myOrders } = useStore();

  if (myOrders.length === 0) {
    return (
      <div className="ge-panel" style={{ textAlign: 'center', padding: 40 }}>
        <Package size={40} color="#c7ccc2" />
        <p style={{ marginTop: 12, color: 'var(--muted)' }}>You haven't placed any orders yet.</p>
        <Link className="ge-primary" style={{ maxWidth: 200, margin: '14px auto 0' }} to="/shop">Start shopping</Link>
      </div>
    );
  }

  return (
    <>
      {myOrders.map(o => (
        <div key={o.id} className="ge-ordercard">
          <div className="top">
            <div>
              <b>{o.id}</b>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <span className={'ge-statuspill ' + o.status}>{o.status}</span>
          </div>
          {o.items.map(i => (
            <div key={i.id} className="ge-orderitem"><span>{i.name} × {i.qty}</span><span>{taka(i.price * i.qty)}</span></div>
          ))}
          <div className="ge-sumrow tot" style={{ marginTop: 8 }}><span>Total</span><span>{taka(o.total)}</span></div>
          <Link className="ge-secondary" style={{ marginTop: 10 }} to={`/order/${o.id}`}>View details</Link>
        </div>
      ))}
    </>
  );
}
