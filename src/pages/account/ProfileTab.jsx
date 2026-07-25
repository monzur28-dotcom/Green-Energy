import React from 'react';
import { useStore } from '../../context/StoreContext.jsx';

export default function ProfileTab() {
  const { currentUser, myOrders } = useStore();

  return (
    <div className="ge-panel">
      <h3>Account details</h3>
      <div className="ge-field"><label>Full name</label><input value={currentUser.name} disabled /></div>
      <div className="ge-2col">
        <div className="ge-field"><label>Email</label><input value={currentUser.email} disabled /></div>
        <div className="ge-field"><label>Phone</label><input value={currentUser.phone} disabled /></div>
      </div>
      <div className="ge-note">Member since {new Date(currentUser.createdAt).toLocaleDateString()} · {myOrders.length} order{myOrders.length !== 1 ? 's' : ''} placed</div>
    </div>
  );
}
