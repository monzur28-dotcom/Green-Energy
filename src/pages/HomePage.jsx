import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, Wallet, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const TRUST_ICONS = [ShieldCheck, Truck, Wallet, CreditCard];

export default function HomePage() {
  const { content, products, concerns, brands } = useStore();
  const navigate = useNavigate();
  const [concern, setConcern] = useState(null);
  const [heroSlide, setHeroSlide] = useState(0);

  const heroImages = useMemo(() => (content.hero.images || []).filter(Boolean), [content.hero.images]);

  useEffect(() => {
    if (heroImages.length < 2) { setHeroSlide(0); return; }
    const t = setInterval(() => setHeroSlide(s => (s + 1) % heroImages.length), 4500);
    return () => clearInterval(t);
  }, [heroImages.length]);

  const featured = useMemo(() => {
    const list = concern ? products.filter(p => p.concern === concern) : products;
    return list.slice(0, 8);
  }, [products, concern]);

  return (
    <div className="ge-wrap">
      <div className="ge-hero">
        {heroImages.map((img, i) => (
          <div key={i} className={'ge-heroslide' + (i === heroSlide ? ' on' : '')} style={{ backgroundImage: `url(${img})` }} />
        ))}
        {heroImages.length > 0 && <div className="ge-herooverlay" />}
        <div className="eyebrow">{content.hero.eyebrow}</div>
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
        {content.hero.cta && <Link className="cta" to="/shop?cat=skincare">{content.hero.cta}</Link>}
        {heroImages.length > 1 && (
          <div className="ge-herodots">
            {heroImages.map((_, i) => <button key={i} className={'ge-herodot' + (i === heroSlide ? ' on' : '')} onClick={() => setHeroSlide(i)} aria-label={`Slide ${i + 1}`} />)}
          </div>
        )}
      </div>

      <div className="ge-concern">
        <div className="lab"><Sparkles size={16} color="#14532d" /> {content.homepage.concernLabel}</div>
        <div className="ge-cchips">
          {concerns.map(cc => (
            <button key={cc} className={'ge-cchip' + (concern === cc ? ' on' : '')} onClick={() => setConcern(concern === cc ? null : cc)}>{cc}</button>
          ))}
        </div>
      </div>

      <div className="ge-trust">
        {(content.homepage.trustBadges || []).map((b, i) => {
          const Icon = TRUST_ICONS[i] || ShieldCheck;
          return <div key={i}><div className="ic"><Icon size={20} /></div><div><b>{b.title}</b><span>{b.subtitle}</span></div></div>;
        })}
      </div>

      <div className="ge-sech">{content.homepage.brandsHeading}</div>
      <div className="ge-secsub">{content.homepage.brandsSubheading}</div>
      <div className="ge-brandstrip">
        {brands.map(b => (
          <div key={b.name} className="ge-btile" onClick={() => navigate(`/shop?q=${encodeURIComponent(b.name)}`)}>
            <div className="bn">{b.name}</div>
            <div className="bo">{b.off}</div>
          </div>
        ))}
      </div>

      <div className="ge-sechrow">
        <div>
          <div className="ge-sech">{concern ? concern : 'New arrivals'}</div>
          <div className="ge-secsub">Fresh picks from across the store</div>
        </div>
        <Link className="ge-viewall" to="/shop">View all products →</Link>
      </div>
      <div className="ge-grid">
        {featured.map(p => <ProductCard key={p.id} product={p} />)}
        {featured.length === 0 && <div className="ge-empty">No products found for this concern yet.</div>}
      </div>
    </div>
  );
}
