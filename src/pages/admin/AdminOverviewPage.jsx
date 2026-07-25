import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { taka } from '../../data.js';

export default function AdminOverviewPage() {
  const { orders, products, users } = useStore();

  const stats = useMemo(() => {
    const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    return { revenue, orderCount: orders.length, pending, customerCount: users.length, productCount: products.length };
  }, [orders, products, users]);

  const topProducts = useMemo(() => {
    const counts = {};
    orders.forEach(o => o.items.forEach(i => { counts[i.id] = (counts[i.id] || 0) + i.qty; }));
    return Object.entries(counts)
      .map(([id, qty]) => ({ product: products.find(p => p.id === +id), qty }))
      .filter(x => x.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders, products]);

  return (
    <>
      <div className="ge-admhead">
        <div><h1>Dashboard overview</h1><p>Store performance at a glance</p></div>
      </div>

      <div className="ge-statgrid">
        <div className="ge-statcard"><div className="lab">Total revenue</div><div className="val">{taka(stats.revenue)}</div><div className="delta">From {stats.orderCount} order{stats.orderCount !== 1 ? 's' : ''}</div></div>
        <div className="ge-statcard"><div className="lab">Pending orders</div><div className="val">{stats.pending}</div><div className="delta">Need action</div></div>
        <div className="ge-statcard"><div className="lab">Customers</div><div className="val">{stats.customerCount}</div><div className="delta">Registered accounts</div></div>
        <div className="ge-statcard"><div className="lab">Products</div><div className="val">{stats.productCount}</div><div className="delta">Live in catalog</div></div>
      </div>

      <div className="ge-panel">
        <h3>Recent orders</h3>
        {orders.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No orders yet.</p> : (
          <div className="ge-tablewrap">
            <table className="ge-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 8).map(o => (
                  <tr key={o.id}>
                    <td><Link to={`/order/${o.id}`} style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>{o.id}</Link></td>
                    <td>{o.customer.name}</td>
                    <td>{o.items.reduce((a, i) => a + i.qty, 0)}</td>
                    <td>{taka(o.total)}</td>
                    <td><span className={'ge-statuspill ' + o.status}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="ge-panel">
        <h3>Top-selling products</h3>
        {topProducts.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No sales data yet.</p> : (
          <div className="ge-tablewrap">
            <table className="ge-table">
              <thead><tr><th>Product</th><th>Brand</th><th>Units sold</th></tr></thead>
              <tbody>
                {topProducts.map(t => (
                  <tr key={t.product.id}>
                    <td>{t.product.name}</td>
                    <td>{t.product.brand}</td>
                    <td>{t.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
