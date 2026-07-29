import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Plus, Gift } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { taka, pctOff } from '../data.js';

export default function ProductCard({ product: p }) {
  const { wishlist, toggleWishlist, addToCart, openCart, CAT } = useStore();
  const c = CAT[p.cat] || CAT.all;

  return (
    <Link to={`/product/${p.id}`} className="ge-pcard">
      <div className={'ge-ptile' + (p.sold ? ' ge-soldwrap' : '')} style={{ background: p.image ? '#fff' : c.tint }}>
        {p.image ? <img src={p.image} alt={p.name} className="ge-pimg" /> : <c.Icon size={40} color={c.fg} strokeWidth={1.4} />}
        {!p.sold && pctOff(p) > 0 && <span className="ge-off">-{pctOff(p)}%</span>}
        {p.tag && !p.sold && <span className="ge-tag">{p.tag === 'Combo' || p.tag === 'Buy 1 Get 1' ? <Gift size={11} /> : null}{p.tag}</span>}
        <button className="ge-wish" onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p.id); }}>
          <Heart size={16} color={wishlist[p.id] ? '#d9a441' : '#6d766c'} fill={wishlist[p.id] ? '#d9a441' : 'none'} />
        </button>
      </div>
      <div className="ge-pbody">
        <div className="ge-pbrand">{p.brand}</div>
        <div className="ge-pname">{p.name}</div>
        <div className="ge-rate">
          <span className="n"><Star size={11} fill="#fff" /> {p.rating}</span>
          <span>({p.reviews})</span>
        </div>
        <div className="ge-pricerow">
          <span className="ge-price">{taka(p.price)}</span>
          {p.mrp > p.price && <span className="ge-mrp">{taka(p.mrp)}</span>}
        </div>
        {p.sold
          ? <button className="ge-addbtn dis" onClick={e => e.preventDefault()}>Sold out</button>
          : <button className="ge-addbtn" onClick={e => { e.preventDefault(); e.stopPropagation(); addToCart(p.id); openCart(); }}><Plus size={15} /> Add to cart</button>}
      </div>
    </Link>
  );
}
