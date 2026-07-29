import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const PAGE_SIZE = 12;

export default function ShopPage() {
  const { products, categories, CAT, concerns } = useStore();
  const [params, setParams] = useSearchParams();

  const cat = params.get('cat') || 'all';
  const sub = params.get('sub') || '';
  const concern = params.get('concern') || '';
  const brand = params.get('brand') || '';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'relevance';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10));

  const update = patch => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => { if (v) next.set(k, v); else next.delete(k); });
    if (!('page' in patch)) next.delete('page');
    setParams(next);
  };

  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).sort(), [products]);

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (cat === 'all' || p.cat === cat) &&
      (!sub || p.sub === sub) &&
      (!concern || p.concern === concern) &&
      (!brand || p.brand === brand) &&
      (p.name + ' ' + p.brand).toLowerCase().includes(q.toLowerCase())
    );
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest') list = [...list].sort((a, b) => b.id - a.id);
    return list;
  }, [products, cat, sub, concern, brand, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = cat !== 'all' || sub || concern || brand || q;

  return (
    <div className="ge-wrap">
      <div className="ge-sech">{q ? `Search results for “${q}”` : cat === 'all' ? 'Shop all products' : (CAT[cat]?.name || 'Shop all products')}</div>
      <div className="ge-secsub">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</div>

      <div className="ge-shoplayout">
        <aside className="ge-filterbox">
          <div className="ge-filtergroup">
            <h4>Sort by</h4>
            <select className="ge-sortselect" value={sort} onChange={e => update({ sort: e.target.value })}>
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>

          <h4>Category</h4>
          <div className="ge-filtergroup">
            {categories.map(c => (
              <button key={c.id} className={'ge-filterlink' + (cat === c.id ? ' on' : '')} onClick={() => update({ cat: c.id === 'all' ? '' : c.id, sub: '' })}>
                {c.name}
              </button>
            ))}
          </div>

          {cat !== 'all' && CAT[cat]?.subs.length > 0 && (
            <div className="ge-filtergroup">
              <h4>Subcategory</h4>
              {CAT[cat].subs.map(s => (
                <button key={s} className={'ge-filterlink' + (sub === s ? ' on' : '')} onClick={() => update({ sub: sub === s ? '' : s })}>{s}</button>
              ))}
            </div>
          )}

          <div className="ge-filtergroup">
            <h4>Concern</h4>
            {concerns.map(cc => (
              <button key={cc} className={'ge-filterlink' + (concern === cc ? ' on' : '')} onClick={() => update({ concern: concern === cc ? '' : cc })}>{cc}</button>
            ))}
          </div>

          <div className="ge-filtergroup">
            <h4>Brand</h4>
            {brands.map(b => (
              <button key={b} className={'ge-filterlink' + (brand === b ? ' on' : '')} onClick={() => update({ brand: brand === b ? '' : b })}>{b}</button>
            ))}
          </div>

          {hasFilters && <button className="ge-clearfilters" onClick={() => setParams({})}>Clear all filters</button>}
        </aside>

        <div>
          <div className="ge-grid">
            {pageItems.map(p => <ProductCard key={p.id} product={p} />)}
            {filtered.length === 0 && <div className="ge-empty">No products found. Try another brand, category, or concern.</div>}
          </div>

          {totalPages > 1 && (
            <div className="ge-pagination">
              <button disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={n === page ? 'on' : ''} onClick={() => update({ page: String(n) })}>{n}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => update({ page: String(page + 1) })}>›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
