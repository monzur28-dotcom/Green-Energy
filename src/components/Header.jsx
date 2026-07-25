import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Leaf, Menu, User, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function Header() {
  const { content, categories, cartCount, wishlistCount, currentUser, logout, openCart } = useStore();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(params.get('q') || '');
  const [mobileNav, setMobileNav] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const activeCat = params.get('cat') || (location.pathname === '/' ? 'all' : '');

  const submitSearch = e => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };

  const goCat = id => navigate(`/shop?cat=${id}`);

  return (
    <>
      <div className="ge-topbar">
        <span>{content.topbar.promo}</span>
        <span>Hotline: <b>{content.topbar.hotline}</b></span>
      </div>

      <header className="ge-header">
        <div className="ge-hrow">
          <button className="ge-menubtn" onClick={() => setMobileNav(m => !m)} aria-label="Menu"><Menu size={20} /></button>
          <Link to="/" className="ge-brand"><span className="lf"><Leaf size={20} /></span><span>{content.brand.name}<small>{content.brand.tagline}</small></span></Link>

          <nav className="ge-navlinks">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>{content.nav.home}</NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>{content.nav.shop}</NavLink>
            <NavLink to="/track-order" className={({ isActive }) => isActive ? 'active' : ''}>{content.nav.trackOrder}</NavLink>
          </nav>

          <form className="ge-search" onSubmit={submitSearch}>
            <Search size={18} color="#6d766c" />
            <input placeholder={content.search.placeholder} value={query} onChange={e => setQuery(e.target.value)} />
          </form>

          <div className="ge-icons">
            <Link to="/wishlist" className="ge-heartbtn" title="Wishlist">
              <Heart size={19} />
              {wishlistCount > 0 && <span className="ge-badge">{wishlistCount}</span>}
            </Link>
            <button className="ge-cartbtn" onClick={openCart}>
              <ShoppingCart size={18} /> Cart
              {cartCount > 0 && <span className="ge-badge">{cartCount}</span>}
            </button>
            <div className="ge-userwrap">
              <button className="ge-userbtn" onClick={() => setUserMenu(m => !m)} title="Account"><User size={19} /></button>
              {userMenu && (
                <div className="ge-usermenu" onMouseLeave={() => setUserMenu(false)}>
                  {currentUser ? (
                    <>
                      <div className="head"><b>{currentUser.name}</b><span>{currentUser.email}</span></div>
                      <Link to="/account" onClick={() => setUserMenu(false)}><User size={15} /> My account</Link>
                      <Link to="/account/orders" onClick={() => setUserMenu(false)}><Package size={15} /> My orders</Link>
                      <button className="danger" onClick={() => { logout(); setUserMenu(false); navigate('/'); }}><LogOut size={15} /> Sign out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setUserMenu(false)}><User size={15} /> Sign in</Link>
                      <Link to="/register" onClick={() => setUserMenu(false)}><User size={15} /> Create account</Link>
                    </>
                  )}
                  <Link to="/admin/login" onClick={() => setUserMenu(false)}><LayoutDashboard size={15} /> Admin dashboard</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileNav && (
          <nav className="ge-navlinks" style={{ display: 'flex', flexDirection: 'column', maxWidth: 1240, margin: '10px auto 0', padding: '0 4px' }}>
            <NavLink to="/" end onClick={() => setMobileNav(false)}>{content.nav.home}</NavLink>
            <NavLink to="/shop" onClick={() => setMobileNav(false)}>{content.nav.shop}</NavLink>
            <NavLink to="/track-order" onClick={() => setMobileNav(false)}>{content.nav.trackOrder}</NavLink>
          </nav>
        )}
      </header>

      <div className="ge-catrail">
        <div className="ge-catinner">
          {categories.map(c => (
            <button key={c.id} className={'ge-cat' + (activeCat === c.id ? ' on' : '')} onClick={() => goCat(c.id)}>
              <c.Icon size={16} /> {c.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
