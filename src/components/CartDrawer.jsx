import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { taka } from '../data.js';

export default function CartDrawer() {
  const { cartItems, cartCount, subtotal, freeShip, setQty, settings, cartOpen, closeCart, CAT } = useStore();
  const navigate = useNavigate();
  if (!cartOpen) return null;

  const goCheckout = () => { closeCart(); navigate('/checkout'); };

  return (
    <div className="ge-scrim" onClick={closeCart}>
      <div className="ge-drawer" onClick={e => e.stopPropagation()}>
        <div className="ge-dhead">
          <h3>Your Bag {cartCount > 0 && `(${cartCount})`}</h3>
          <button className="ge-x" onClick={closeCart}><X size={18} /></button>
        </div>
        <div className="ge-ditems">
          {cartItems.length === 0 && <div className="ge-emptycart"><ShoppingCart size={40} color="#c7ccc2" /><p style={{ marginTop: 12 }}>Your bag is empty.</p></div>}
          {cartItems.map(i => {
            const c = CAT[i.cat] || CAT.all;
            return (
              <div key={i.id} className="ge-citem">
                <div className="ge-cthumb" style={{ background: c.tint }}>
                  {i.image ? <img src={i.image} alt={i.name} className="ge-pimg" /> : <c.Icon size={28} color={c.fg} strokeWidth={1.5} />}
                </div>
                <div className="ge-cinfo">
                  <div className="br">{i.brand}</div>
                  <div className="nm">{i.name}</div>
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
        {cartItems.length > 0 && (
          <div className="ge-dfoot">
            {!freeShip && <div className="ge-ship">Add {taka(settings.freeShipThreshold - subtotal)} more for free shipping</div>}
            {freeShip && <div className="ge-ship">🎉 You’ve unlocked free shipping</div>}
            <div className="ge-sumrow"><span>Subtotal</span><span>{taka(subtotal)}</span></div>
            <button className="ge-primary" onClick={goCheckout}>Proceed to checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
