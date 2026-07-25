import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { taka, ORDER_STATUSES } from '../../data.js';

export default function AdminOrdersPage() {
  const { orders, setOrderStatus } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => orders.filter(o =>
    (!statusFilter || o.status === statusFilter) &&
    (o.id + ' ' + o.customer.name + ' ' + o.customer.phone).toLowerCase().includes(query.toLowerCase())
  ), [orders, query, statusFilter]);

  return (
    <>
      <div className="ge-admhead">
        <div><h1>Orders</h1><p>{orders.length} total orders</p></div>
      </div>

      <div className="ge-panel">
        <div className="ge-admtoolbar">
          <div className="ge-admsearch"><Search size={15} color="#6d766c" /><input placeholder="Search order ID, customer, phone…" value={query} onChange={e => setQuery(e.target.value)} /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '8px 12px', fontSize: 13 }}>
            <option value="">All statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="ge-tablewrap">
          <table className="ge-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Payment</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><Link to={`/order/${o.id}`} style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>{o.id}</Link></td>
                  <td>{o.customer.name}</td>
                  <td>{o.customer.phone}</td>
                  <td>{o.payment}</td>
                  <td>{taka(o.total)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select className="ge-statusselect" value={o.status} onChange={e => setOrderStatus(o.id, e.target.value)}>
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>No orders match.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
