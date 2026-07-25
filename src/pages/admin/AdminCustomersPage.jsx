import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { taka } from '../../data.js';

export default function AdminCustomersPage() {
  const { users, orders } = useStore();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => users.map(u => {
    const userOrders = orders.filter(o => o.userId === u.id);
    return { ...u, orderCount: userOrders.length, totalSpent: userOrders.reduce((a, o) => a + o.total, 0) };
  }).filter(u => (u.name + ' ' + u.email).toLowerCase().includes(query.toLowerCase())), [users, orders, query]);

  return (
    <>
      <div className="ge-admhead">
        <div><h1>Customers</h1><p>{users.length} registered accounts</p></div>
      </div>

      <div className="ge-panel">
        <div className="ge-admtoolbar">
          <div className="ge-admsearch"><Search size={15} color="#6d766c" /><input placeholder="Search customers…" value={query} onChange={e => setQuery(e.target.value)} /></div>
        </div>
        <div className="ge-tablewrap">
          <table className="ge-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Joined</th></tr></thead>
            <tbody>
              {rows.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.orderCount}</td>
                  <td>{taka(u.totalSpent)}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>No registered customers yet — guest checkouts don't create an account.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
