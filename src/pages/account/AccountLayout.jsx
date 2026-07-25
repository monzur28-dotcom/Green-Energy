import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Package, LogOut } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function AccountLayout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="ge-wrap">
      <div className="ge-sech">My account</div>
      <div className="ge-secsub">Welcome back, {currentUser?.name}</div>
      <div className="ge-acctlayout">
        <nav className="ge-acctnav">
          <NavLink to="/account" end className={({ isActive }) => isActive ? 'on' : ''}><User size={15} /> Profile</NavLink>
          <NavLink to="/account/orders" className={({ isActive }) => isActive ? 'on' : ''}><Package size={15} /> My orders</NavLink>
          <button onClick={() => { logout(); navigate('/'); }}><LogOut size={15} /> Sign out</button>
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
