import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { taka } from '../data.js';

export default function CartPage() {
  const { cartItems, cartCount, subtotal, freeShip, setQty, settings, CAT } = useStore();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="ge-wrap narrow">
        <div className="ge-emptycart">
          <ShoppingCart size={48} color="#c7ccc2" />
          <p style={{ marginTop: 14, fontSize: 15 }}>Your bag is empty.</p>
          <Link className="ge-primary" style={{ maxWidth: 220, margin: '18px auto 0' }} to="/shop">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ge-wrap">
      <div className="ge-sech">Your Bag ({cartCount})</div>
      <div className="ge-secsub">Review your items before checkout</div>

      <div className="ge-cartlayout">
        <div className="ge-cartlist">
          {cartItems.map(i => {
            const c = CAT[i.cat] || CAT.all;
            return (
              <div key={i.id} className="ge-citem" style={{ padding: 16 }}>
                <div className="ge-cthumb" style={{ width: 76, height: 76, background: c.tint }}>
                  {i.image ? <img src={i.image} alt={i.name} className="ge-pimg" /> : <c.Icon size={34} color={c.fg} strokeWidth={1.5} />}
                </div>
                <div className="ge-cinfo">
                  <div className="br">{i.brand}</div>
                  <Link to={`/product/${i.id}`} className="nm" style={{ textDecoration: 'none', color: 'inherit' }}>{i.name}</Link>
                  <div className="pr">{taka(i.price * i.qty)}</div>
                  <div className="ge-qty">
                    <button onClick={() => setQty(i.id, i.qty - 1)}><Minus size={14} /></button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)}><Plus size={14} /></button>
                  </div>
                </div>
                <button className="ge-rm" onClick={() => setQty(i.id, 0)}><Trash2 size={17} /></button>
              </div>
            );
          })}
        </div>

        <div className="ge-summarybox">
          <h3>Order summary</h3>
          {!freeShip && <div className="ge-ship">Add {taka(settings.freeShipThreshold - subtotal)} more for free shipping</div>}
          {freeShip && <div className="ge-ship">🎉 You’ve unlocked free shipping</div>}
          <div className="ge-sumrow"><span>Subtotal</span><span>{taka(subtotal)}</span></div>
          <div className="ge-sumrow"><span>Delivery</span><span>{freeShip ? 'Free' : 'Calculated at checkout'}</span></div>
          <button className="ge-primary" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
          <Link className="ge-secondary" style={{ marginTop: 10 }} to="/shop">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
