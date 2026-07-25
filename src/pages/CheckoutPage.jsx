import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { DIVISIONS, taka } from '../data.js';

export default function CheckoutPage() {
  const { cartItems, subtotal, freeShip, shippingFor, settings, currentUser, placeOrder } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: currentUser?.name || '', phone: currentUser?.phone || '', address: '', division: 'Dhaka',
  });
  const [payment, setPayment] = useState(settings.enabledPayments[0] || 'Cash on Delivery');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) setForm(f => ({ ...f, name: f.name || currentUser.name, phone: f.phone || currentUser.phone }));
  }, [currentUser]);

  if (cartItems.length === 0) return <Navigate to="/cart" replace />;

  const delivery = shippingFor(form.division);
  const total = subtotal + delivery;
  const valid = form.name.trim() && form.phone.trim() && form.address.trim();

  const submit = async e => {
    e.preventDefault();
    if (!valid) return;
    setPlacing(true);
    setError('');
    try {
      const order = await placeOrder({ form, payment });
      navigate(`/order/${order.id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  };

  return (
    <div className="ge-wrap narrow">
      <div className="ge-steps">
        <div className="st on"><span className="num"><Check size={12} /></span> Bag</div>
        <div className="sep" />
        <div className="st on"><span className="num">2</span> Checkout</div>
        <div className="sep" />
        <div className="st"><span className="num">3</span> Confirmation</div>
      </div>

      <div className="ge-sech">Checkout</div>
      <div className="ge-secsub">Enter your delivery details to place your order</div>
      {error && <div className="ge-formerr">{error}</div>}

      <form onSubmit={submit}>
        <div className="ge-field"><label>Full name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Monzur Ahmed" required /></div>
        <div className="ge-2col">
          <div className="ge-field"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" required /></div>
          <div className="ge-field"><label>Division</label>
            <select value={form.division} onChange={e => setForm({ ...form, division: e.target.value })}>
              {DIVISIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="ge-field"><label>Delivery address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House, road, area" required /></div>

        <div className="ge-field">
          <label>Payment method</label>
          <div className="ge-payrow">
            {settings.enabledPayments.map(p => <div key={p} className={'ge-pay' + (payment === p ? ' on' : '')} onClick={() => setPayment(p)}>{p}</div>)}
          </div>
        </div>

        <div className="ge-summarybox" style={{ position: 'static', marginTop: 8 }}>
          <h3>Order summary</h3>
          <div className="ge-sumrow"><span>Subtotal</span><span>{taka(subtotal)}</span></div>
          <div className="ge-sumrow"><span>Delivery</span><span className={delivery === 0 ? 'ge-free' : ''}>{delivery === 0 ? 'Free' : taka(delivery)}</span></div>
          <div className="ge-sumrow tot"><span>Total payable</span><span>{taka(total)}</span></div>
        </div>

        <button className="ge-primary" type="submit" disabled={!valid || placing}>{placing ? 'Placing order…' : `Place order · ${taka(total)}`}</button>
      </form>
    </div>
  );
}
