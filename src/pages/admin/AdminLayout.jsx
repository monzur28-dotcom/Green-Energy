import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, FileEdit, Settings, LogOut, Leaf, Menu, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

const LINKS = [
  { to: '/admin', end: true, Icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/products', Icon: Package, label: 'Products' },
  { to: '/admin/orders', Icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/customers', Icon: Users, label: 'Customers' },
  { to: '/admin/content', Icon: FileEdit, label: 'Content' },
  { to: '/admin/settings', Icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { adminLogout } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="ge-admroot">
      <aside className={'ge-admsidebar' + (open ? ' open' : '')} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
        <div className="ge-admbrand"><span className="lf"><Leaf size={18} /></span> Green Energy</div>
        <nav className="ge-admnav">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              <l.Icon size={16} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="ge-admexit" style={{ marginBottom: 4 }}><ExternalLink size={16} /> View store</Link>
        <button className="ge-admexit" onClick={() => { adminLogout(); navigate('/'); }}><LogOut size={16} /> Exit admin</button>
      </aside>
      <main className="ge-admmain">
        <button className="ge-admmenubtn" onClick={() => setOpen(true)}><Menu size={18} /></button>
        <Outlet />
      </main>
    </div>
  );
}
