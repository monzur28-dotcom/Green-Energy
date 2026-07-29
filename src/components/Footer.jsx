import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function Footer() {
  const { content, categories, adminSession } = useStore();
  const navigate = useNavigate();

  return (
    <footer className="ge-footer">
      <div className="ge-finner">
        <div className="ge-fcol ge-fbrand">
          <Link to="/" className="ge-brand" style={{ color: '#fff' }}><span className="lf"><Leaf size={20} /></span><span>{content.brand.name}<small style={{ color: '#a9cdb8' }}>{content.brand.tagline}</small></span></Link>
          <p>{content.footer.blurb}</p>
          <div className="ge-social">
            <a href={content.footer.facebook || '#'} onClick={e => (!content.footer.facebook || content.footer.facebook === '#') && e.preventDefault()}>Facebook</a>
            <a href={content.footer.instagram || '#'} onClick={e => (!content.footer.instagram || content.footer.instagram === '#') && e.preventDefault()}>Instagram</a>
            <a href={content.footer.youtube || '#'} onClick={e => (!content.footer.youtube || content.footer.youtube === '#') && e.preventDefault()}>YouTube</a>
          </div>
        </div>
        <div className="ge-fcol">
          <h4>{content.footer.shopHeading}</h4>
          {categories.filter(c => c.id !== 'all').map(c => (
            <Link key={c.id} to={`/shop?cat=${c.id}`}>{c.name}</Link>
          ))}
        </div>
        <div className="ge-fcol">
          <h4>{content.footer.helpHeading}</h4>
          <Link to="/track-order">Track Order</Link>
          <Link to="/account/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div className="ge-fcol">
          <h4>{content.footer.contactHeading}</h4>
          <span><MapPin size={13} /> {content.footer.address}</span>
          <span><Phone size={13} /> {content.footer.phone}</span>
          <span><Mail size={13} /> {content.footer.email}</span>
          <span>{content.footer.hours}</span>
        </div>
      </div>
      <div className="ge-fpay">
        <span>We accept:</span>
        <div className="ge-fpills">
          {['Cash on Delivery', 'bKash', 'Nagad', 'SSLCommerz', 'Visa', 'Mastercard'].map(p => <span key={p} className="ge-fpill">{p}</span>)}
        </div>
      </div>
      <div className="ge-fbottom">
        <span>© {new Date().getFullYear()} {content.footer.copyrightText}</span>
        <button className="ge-adminlink" onClick={() => navigate(adminSession ? '/admin' : '/admin/login')}>Admin</button>
      </div>
    </footer>
  );
}
