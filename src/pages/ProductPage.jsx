import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Star, Heart, Plus, Minus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { taka, pctOff } from '../data.js';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const { products, wishlist, toggleWishlist, addToCart, openCart, CAT } = useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');

  const product = products.find(p => p.id === +id);
  const related = useMemo(() => product ? products.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4) : [], [products, product]);

  if (!product) return <Navigate to="/404" replace />;

  const c = CAT[product.cat] || CAT.all;
  const images = [product.image].filter(Boolean);

  return (
    <div className="ge-wrap">
      <div className="ge-crumb">
        <Link to="/">Home</Link> / <Link to={`/shop?cat=${product.cat}`}>{c.name}</Link> / <span>{product.name}</span>
      </div>

      <div className="ge-pdlayout">
        <div className="ge-pdgallery">
          <div className="ge-pdmain" style={{ background: product.image ? '#fff' : c.tint }}>
            {product.image ? <img src={product.image} alt={product.name} className="ge-pimg" /> : <c.Icon size={110} color={c.fg} strokeWidth={1.3} />}
          </div>
          {images.length > 1 && (
            <div className="ge-pdthumbs">
              {images.map((img, i) => <button key={i} className="on"><img src={img} alt="" className="ge-pimg" /></button>)}
            </div>
          )}
        </div>

        <div className="ge-pdinfo">
          <div className="ge-pbrand">{product.brand}</div>
          <h1>{product.name}</h1>
          <div className="ge-rate">
            <span className="n"><Star size={11} fill="#fff" /> {product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>
          <div className="ge-pricerow" style={{ marginTop: 14 }}>
            <span className="ge-price" style={{ fontSize: 30 }}>{taka(product.price)}</span>
            {product.mrp > product.price && <span className="ge-mrp" style={{ fontSize: 16 }}>{taka(product.mrp)}</span>}
            {pctOff(product) > 0 && <span className="ge-off" style={{ position: 'static' }}>-{pctOff(product)}%</span>}
          </div>

          {product.sold ? (
            <div className="ge-pdactions">
              <button className="ge-primary" disabled>Sold out</button>
            </div>
          ) : (
            <>
              <div className="ge-qtypick">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}><Plus size={14} /></button>
              </div>
              <div className="ge-pdactions">
                <button className="ge-primary" onClick={() => { addToCart(product.id, qty); openCart(); }}>Add to bag · {taka(product.price * qty)}</button>
                <button className="ge-wish" style={{ position: 'static', width: 50, height: 50 }} onClick={() => toggleWishlist(product.id)}>
                  <Heart size={20} color={wishlist[product.id] ? '#d9a441' : '#6d766c'} fill={wishlist[product.id] ? '#d9a441' : 'none'} />
                </button>
              </div>
            </>
          )}

          <div className="ge-pdmeta">
            <span><ShieldCheck size={14} style={{ verticalAlign: -2 }} /> <b>100% authentic</b> — sourced directly from {product.brand}</span>
            <span><Truck size={14} style={{ verticalAlign: -2 }} /> Free shipping on orders over ৳999, cash on delivery available</span>
            <span><RotateCcw size={14} style={{ verticalAlign: -2 }} /> Easy 7-day returns on unopened items</span>
          </div>

          <div className="ge-tabs" style={{ marginTop: 26 }}>
            <button className={'ge-tab' + (tab === 'description' ? ' on' : '')} onClick={() => setTab('description')}>Description</button>
            <button className={'ge-tab' + (tab === 'reviews' ? ' on' : '')} onClick={() => setTab('reviews')}>Reviews ({product.reviews})</button>
          </div>
          {tab === 'description' ? (
            <p style={{ color: '#6d766c', fontSize: 14, lineHeight: 1.7 }}>
              100% authentic {product.brand} product, sourced directly. {product.concern ? `Great for ${product.concern.toLowerCase()}. ` : ''}
              {product.sub ? `Part of our ${product.sub.toLowerCase()} range. ` : ''}
              Free shipping on orders over ৳999, with cash on delivery available nationwide.
            </p>
          ) : (
            <p style={{ color: '#6d766c', fontSize: 14, lineHeight: 1.7 }}>
              Average rating <b style={{ color: 'var(--ink)' }}>{product.rating} / 5</b> from {product.reviews} verified buyers.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <>
          <div className="ge-sech">You may also like</div>
          <div className="ge-secsub">More from {c.name}</div>
          <div className="ge-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
