import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../api.js';
import { iconFor } from '../icons.js';

const ALL_CATEGORY = { id: 'all', name: 'All', icon: 'Sparkles', tint: '#e9f4ee', fg: '#14532d', subs: [] };

const StoreCtx = createContext(null);

const read = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
};
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} };

export function StoreProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [products, setProducts] = useState([]);
  const [categoriesRaw, setCategoriesRaw] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [brands, setBrands] = useState([]);
  const [content, setContent] = useState(null);
  const [settings, setSettings] = useState(null);
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState({});

  const [userToken, setUserToken] = useState(() => read('ge_user_token', null));
  const [currentUser, setCurrentUser] = useState(null);
  const [adminToken, setAdminToken] = useState(() => read('ge_admin_token', null));
  const [adminSession, setAdminSession] = useState(false);

  const [orders, setOrders] = useState([]); // admin: all orders
  const [myOrders, setMyOrders] = useState([]); // customer: own orders
  const [users, setUsers] = useState([]); // admin: registered customers

  const [cartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  // ---- initial load ----
  useEffect(() => {
    setCart(read('ge_cart', {}));
    setWishlist(read('ge_wishlist', {}));

    (async () => {
      try {
        const [prods, cats, cons, brds, cnt, sett] = await Promise.all([
          api.get('/products'), api.get('/categories'), api.get('/concerns'), api.get('/brands'), api.get('/content'), api.get('/settings'),
        ]);
        setProducts(prods);
        setCategoriesRaw(cats);
        setConcerns(cons);
        setBrands(brds);
        setContent(cnt);
        setSettings(sett);

        if (userToken) {
          try { setCurrentUser((await api.get('/auth/me', userToken)).user); }
          catch (e) { setUserToken(null); localStorage.removeItem('ge_user_token'); }
        }
        if (adminToken) {
          try { const s = await api.get('/admin/session', adminToken); setAdminSession(!!s.active); if (!s.active) { setAdminToken(null); localStorage.removeItem('ge_admin_token'); } }
          catch (e) { setAdminToken(null); localStorage.removeItem('ge_admin_token'); }
        }
      } catch (e) {
        setLoadError('Could not reach the store server. Make sure the API server is running (npm run server), then reload this page.');
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) write('ge_cart', cart); }, [cart, loaded]);
  useEffect(() => { if (loaded) write('ge_wishlist', wishlist); }, [wishlist, loaded]);

  // fetch admin-only data once admin session is confirmed
  useEffect(() => {
    if (!adminSession || !adminToken) return;
    api.get('/orders', adminToken).then(setOrders).catch(() => {});
    api.get('/users', adminToken).then(setUsers).catch(() => {});
  }, [adminSession, adminToken]);

  // fetch this customer's orders once logged in
  useEffect(() => {
    if (!currentUser || !userToken) { setMyOrders([]); return; }
    api.get('/orders/mine', userToken).then(setMyOrders).catch(() => {});
  }, [currentUser, userToken]);

  // ---- cart / wishlist (client-side only) ----
  const addToCart = useCallback((id, qty = 1) => setCart(c => ({ ...c, [id]: (c[id] || 0) + qty })), []);
  const setQty = useCallback((id, qty) => setCart(c => { const n = { ...c }; if (qty <= 0) delete n[id]; else n[id] = qty; return n; }), []);
  const clearCart = useCallback(() => setCart({}), []);
  const toggleWishlist = useCallback(id => setWishlist(w => ({ ...w, [id]: !w[id] })), []);

  const cartItems = useMemo(() => Object.entries(cart)
    .map(([id, qty]) => ({ ...products.find(p => p.id === +id), qty }))
    .filter(i => i.id != null), [cart, products]);
  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);
  const subtotal = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const freeShip = settings ? subtotal >= settings.freeShipThreshold : false;
  const wishlistCount = Object.values(wishlist).filter(Boolean).length;
  const wishlistItems = useMemo(() => products.filter(p => wishlist[p.id]), [products, wishlist]);

  const shippingFor = division => {
    if (!settings || cartCount === 0) return 0;
    if (freeShip) return 0;
    return division === 'Dhaka' ? settings.shipDhaka : settings.shipOutside;
  };

  // ---- categories ----
  const categories = useMemo(() => [ALL_CATEGORY, ...categoriesRaw].map(c => ({ ...c, Icon: iconFor(c.icon) })), [categoriesRaw]);
  const CAT = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c])), [categories]);

  const addCategory = async ({ name, icon, subs }) => {
    const created = await api.post('/categories', { name, icon, subs }, adminToken);
    setCategoriesRaw(list => [...list, created]);
    return created;
  };
  const editCategory = async (id, patch) => {
    const updated = await api.put(`/categories/${id}`, patch, adminToken);
    setCategoriesRaw(list => list.map(c => c.id === id ? updated : c));
    return updated;
  };
  const removeCategory = async id => {
    await api.del(`/categories/${id}`, adminToken);
    setCategoriesRaw(list => list.filter(c => c.id !== id));
  };

  // ---- concerns ----
  const addConcern = async label => { const next = await api.post('/concerns', { label }, adminToken); setConcerns(next); };
  const removeConcern = async label => { await api.del(`/concerns/${encodeURIComponent(label)}`, adminToken); setConcerns(list => list.filter(c => c !== label)); };
  const renameConcern = async (oldLabel, newLabel) => {
    const next = await api.put(`/concerns/${encodeURIComponent(oldLabel)}`, { label: newLabel }, adminToken);
    setConcerns(next);
    setProducts(await api.get('/products')); // product.concern values may have been reassigned server-side
  };

  // ---- brands (homepage strip) ----
  const addBrand = async ({ name, off }) => { const next = await api.post('/brands', { name, off }, adminToken); setBrands(next); };
  const editBrand = async (index, patch) => { const next = await api.put(`/brands/${index}`, patch, adminToken); setBrands(next); };
  const removeBrand = async index => { await api.del(`/brands/${index}`, adminToken); setBrands(list => list.filter((_, i) => i !== index)); };

  // ---- content / CMS ----
  const setSection = async (section, patch) => setContent(await api.patch(`/content/section/${section}`, patch, adminToken));

  // ---- products (admin) ----
  const upsertProduct = async p => {
    const isExisting = products.some(x => x.id === p.id);
    const saved = isExisting ? await api.put(`/products/${p.id}`, p, adminToken) : await api.post('/products', p, adminToken);
    setProducts(list => isExisting ? list.map(x => x.id === saved.id ? saved : x) : [saved, ...list]);
    return saved;
  };
  const removeProduct = async id => { await api.del(`/products/${id}`, adminToken); setProducts(list => list.filter(x => x.id !== id)); };

  const updateSettings = async patch => setSettings(await api.put('/settings', patch, adminToken));
  const changeAdminPin = async ({ current, next }) => {
    try { await api.post('/settings/pin', { current, next }, adminToken); return { ok: true }; }
    catch (e) { return { ok: false, error: e.message }; }
  };

  const resetStore = async () => {
    await api.post('/admin/reset', {}, adminToken);
    const [prods, cats, cons, brds, cnt, sett] = await Promise.all([
      api.get('/products'), api.get('/categories'), api.get('/concerns'), api.get('/brands'), api.get('/content'), api.get('/settings'),
    ]);
    setProducts(prods); setCategoriesRaw(cats); setConcerns(cons); setBrands(brds); setContent(cnt); setSettings(sett);
  };

  // ---- admin auth ----
  const adminLogin = async pin => {
    try {
      const { token } = await api.post('/admin/login', { pin });
      setAdminToken(token); write('ge_admin_token', token); setAdminSession(true);
      return true;
    } catch (e) { return false; }
  };
  const adminLogout = () => {
    if (adminToken) api.post('/admin/logout', {}, adminToken).catch(() => {});
    setAdminToken(null); localStorage.removeItem('ge_admin_token'); setAdminSession(false); setOrders([]); setUsers([]);
  };

  // ---- customer auth ----
  const register = async form => {
    try {
      const { token, user } = await api.post('/auth/register', form);
      setUserToken(token); write('ge_user_token', token); setCurrentUser(user);
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message }; }
  };
  const login = async form => {
    try {
      const { token, user } = await api.post('/auth/login', form);
      setUserToken(token); write('ge_user_token', token); setCurrentUser(user);
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message }; }
  };
  const logout = () => {
    if (userToken) api.post('/auth/logout', {}, userToken).catch(() => {});
    setUserToken(null); localStorage.removeItem('ge_user_token'); setCurrentUser(null); setMyOrders([]);
  };

  // ---- orders ----
  const placeOrder = async ({ form, payment }) => {
    const items = cartItems.map(i => ({ id: i.id, qty: i.qty }));
    const order = await api.post('/orders', { items, customer: form, payment }, userToken || undefined);
    clearCart();
    setProducts(await api.get('/products'));
    if (currentUser) setMyOrders(o => [order, ...o]);
    return order;
  };

  const setOrderStatus = async (id, status) => {
    const updated = await api.patch(`/orders/${id}/status`, { status }, adminToken);
    setOrders(list => list.map(o => o.id === id ? updated : o));
  };

  const findOrder = async (id, phone) => {
    try { return await api.get(`/orders/find?id=${encodeURIComponent(id)}&phone=${encodeURIComponent(phone)}`); }
    catch (e) { return null; }
  };

  const value = {
    loaded, loadError,
    products, upsertProduct, removeProduct,
    categories, CAT, addCategory, editCategory, removeCategory,
    concerns, addConcern, removeConcern, renameConcern,
    brands, addBrand, editBrand, removeBrand,
    content: content || { brand: {}, nav: {}, search: {}, topbar: {}, hero: {}, homepage: {}, footer: {} }, setSection,
    settings: settings || { freeShipThreshold: 999, shipDhaka: 60, shipOutside: 120, enabledPayments: ['Cash on Delivery'], adminPin: '' },
    updateSettings, changeAdminPin,
    cart, cartItems, cartCount, subtotal, freeShip, addToCart, setQty, clearCart, shippingFor,
    wishlist, wishlistItems, wishlistCount, toggleWishlist,
    users, currentUser, register, login, logout,
    orders, myOrders, placeOrder, setOrderStatus, findOrder,
    adminSession, adminLogin, adminLogout,
    resetStore,
    cartOpen, openCart, closeCart,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
