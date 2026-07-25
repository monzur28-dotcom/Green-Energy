import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { Check, Package } from 'lucide-react';
import { api } from '../api.js';
import { taka } from '../data.js';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(undefined); // undefined = loading, null = not found
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    let alive = true;
    api.get(`/orders/${id}`).then(o => alive && setOrder(o)).catch(() => alive && setOrder(null));
    return () => { alive = false; };
  }, [id]);

  if (order === undefined) return <div className="ge-wrap narrow"><p style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>Loading order…</p></div>;
  if (order === null) return <Navigate to="/404" replace />;

  return (
    <div className="ge-wrap narrow">
      <div className="ge-modal" style={{ width: '100%', margin: '20px 0' }}>
        <div className="ge-ok">
          <div className="ge-okic"><Check size={38} strokeWidth={3} /></div>
          <h3>{justPlaced ? 'Order confirmed!' : 'Order details'}</h3>
          <p>
            {justPlaced ? <>Thank you, {order.customer.name.split(' ')[0]}. Your order is placed.<br /></> : null}
            Order ID: <span className="ge-oid">{order.id}</span><br />
            <span className={'ge-statuspill ' + order.status} style={{ display: 'inline-block', marginTop: 10 }}>{order.status}</span>
          </p>
        </div>

        <div style={{ padding: '0 30px 30px' }}>
          <div className="ge-ordercard" style={{ margin: 0 }}>
            <div className="top">
              <div><b>Deliver to:</b> {order.customer.name}, {order.customer.address}, {order.customer.division}<br /><b>Phone:</b> {order.customer.phone}</div>
              <div><b>Payment:</b> {order.payment}</div>
            </div>
            {order.items.map(i => (
              <div key={i.id} className="ge-orderitem"><span>{i.name} × {i.qty}</span><span>{taka(i.price * i.qty)}</span></div>
            ))}
            <div className="ge-sumrow" style={{ marginTop: 10 }}><span>Subtotal</span><span>{taka(order.subtotal)}</span></div>
            <div className="ge-sumrow"><span>Delivery</span><span>{order.delivery === 0 ? 'Free' : taka(order.delivery)}</span></div>
            <div className="ge-sumrow tot"><span>Total</span><span>{taka(order.total)}</span></div>
          </div>
          <Link className="ge-primary" to="/shop">Continue shopping</Link>
          <Link className="ge-secondary" style={{ marginTop: 10 }} to="/track-order"><Package size={14} style={{ verticalAlign: -2, marginRight: 4 }} /> Track this order later</Link>
        </div>
      </div>
    </div>
  );
}
