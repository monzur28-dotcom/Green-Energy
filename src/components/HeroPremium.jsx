import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroPremium({ data }) {
  const p = data || {};
  const products = p.products || [];

  return (
    <div className="ge-herop">
      <div className="ge-herop-clouds" aria-hidden="true">
        <span className="c c1" /><span className="c c2" /><span className="c c3" />
      </div>

      <div className="ge-herop-panel">
        {p.eyebrow && <div className="ge-herop-eyebrow">{p.eyebrow}</div>}
        {p.title && <h1>{p.title}</h1>}
        {p.subtitle && <p>{p.subtitle}</p>}
        {p.cta && <Link className="ge-herop-cta" to={p.ctaLink || '/shop'}>{p.cta}</Link>}
      </div>

      {products.length > 0 && (
        <div className="ge-herop-products">
          {products.map((prod, i) => prod.image && (
            <div key={i} className="ge-herop-product" style={{ '--d': `${i * 0.12}s` }}>
              <img src={prod.image} alt={prod.label || ''} loading="lazy" />
              {prod.label && <span>{prod.label}</span>}
            </div>
          ))}
        </div>
      )}

      {p.lifestyleImage && (
        <div className="ge-herop-lifestyle">
          <img src={p.lifestyleImage} alt="" loading="lazy" />
        </div>
      )}
    </div>
  );
}
