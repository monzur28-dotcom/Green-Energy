import express from 'express';
import cors from 'cors';
import {
  PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES,
  listProducts, getProductById, insertProduct, updateProduct, deleteProduct, resetProducts,
  getContent, setContent, getSettings, setSettings,
  createUser, getUserByEmail, getUserById, listUsers,
  listOrders, listOrdersByUser, getOrderById, placeOrderTx, updateOrderStatusRow,
  listCategories, getCategoryById, insertCategory, updateCategory, deleteCategoryRow, countProductsInCategory, resetCategories,
} from './db.js';
import { hashPassword, verifyPassword, createSession, destroySession, getSession, requireAdmin, requireUser, optionalUser } from './auth.js';
import { slugify, CATEGORY_PALETTE } from '../src/icons.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

const tokenFromReq = req => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

const userPublic = u => u && { id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt };
const settingsPublic = s => { const { adminPin, ...rest } = s; return rest; };

// ---------- products ----------
app.get('/api/products', async (req, res) => res.json(await listProducts()));

app.post('/api/products', requireAdmin, async (req, res) => {
  const p = { ...req.body, id: req.body.id || Date.now() };
  res.status(201).json(await insertProduct(p));
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const updated = await updateProduct(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found.' });
  res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  await deleteProduct(Number(req.params.id));
  res.status(204).end();
});

// ---------- categories ----------
app.get('/api/categories', async (req, res) => res.json(await listCategories()));

app.post('/api/categories', requireAdmin, async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Category name is required.' });
  let id = slugify(name);
  let n = 2;
  while (await getCategoryById(id)) { id = `${slugify(name)}-${n}`; n++; }
  const existingCount = (await listCategories()).length;
  const palette = CATEGORY_PALETTE[existingCount % CATEGORY_PALETTE.length];
  const created = await insertCategory({
    id, name, icon: req.body.icon || 'Tag',
    tint: req.body.tint || palette.tint, fg: req.body.fg || palette.fg,
    subs: req.body.subs || [],
  });
  res.status(201).json(created);
});

app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  const updated = await updateCategory(req.params.id, { name: req.body.name, icon: req.body.icon, subs: req.body.subs });
  if (!updated) return res.status(404).json({ error: 'Category not found.' });
  res.json(updated);
});

app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  const count = await countProductsInCategory(req.params.id);
  if (count > 0) return res.status(409).json({ error: `${count} product${count === 1 ? '' : 's'} still use this category. Reassign or delete them first.` });
  await deleteCategoryRow(req.params.id);
  res.status(204).end();
});

// ---------- content / settings ----------
app.get('/api/content', async (req, res) => res.json(await getContent()));

app.patch('/api/content/section/:section', requireAdmin, async (req, res) => {
  const content = await getContent();
  content[req.params.section] = { ...content[req.params.section], ...req.body };
  await setContent(content);
  res.json(content);
});

app.patch('/api/content/cats/:id', requireAdmin, async (req, res) => {
  const content = await getContent();
  content.cats = { ...content.cats, [req.params.id]: req.body.name };
  await setContent(content);
  res.json(content);
});

app.get('/api/settings', async (req, res) => res.json(settingsPublic(await getSettings())));

app.put('/api/settings', requireAdmin, async (req, res) => {
  const settings = await getSettings();
  const { adminPin, ...patch } = req.body; // PIN changes only via /settings/pin
  const next = { ...settings, ...patch };
  await setSettings(next);
  res.json(settingsPublic(next));
});

app.post('/api/settings/pin', requireAdmin, async (req, res) => {
  const { current, next } = req.body;
  const settings = await getSettings();
  if (current !== settings.adminPin) return res.status(400).json({ error: 'Current PIN is incorrect.' });
  if (!next || next.length < 4) return res.status(400).json({ error: 'New PIN must be at least 4 characters.' });
  await setSettings({ ...settings, adminPin: next });
  res.json({ ok: true });
});

app.post('/api/admin/reset', requireAdmin, async (req, res) => {
  await resetProducts(PRODUCTS);
  await resetCategories(DEFAULT_CATEGORIES);
  const settings = await getSettings();
  await setContent(DEFAULT_CONTENT);
  await setSettings({ ...DEFAULT_SETTINGS, adminPin: settings.adminPin });
  res.json({ ok: true });
});

// ---------- admin auth ----------
app.post('/api/admin/login', async (req, res) => {
  const settings = await getSettings();
  if (req.body.pin !== settings.adminPin) return res.status(401).json({ error: 'Wrong PIN. Try again.' });
  const token = await createSession('admin', 'admin');
  res.json({ token });
});
app.post('/api/admin/logout', requireAdmin, async (req, res) => { await destroySession(tokenFromReq(req)); res.status(204).end(); });
app.get('/api/admin/session', async (req, res) => {
  const session = await getSession(tokenFromReq(req));
  res.json({ active: !!(session && session.kind === 'admin') });
});

// ---------- customer auth ----------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) return res.status(400).json({ error: 'All fields are required.' });
  const emailNorm = String(email).trim().toLowerCase();
  if (await getUserByEmail(emailNorm)) return res.status(409).json({ error: 'An account with this email already exists.' });
  const { hash, salt } = hashPassword(password);
  const id = 'U-' + Date.now();
  const createdAt = new Date().toISOString();
  await createUser({ id, name: name.trim(), email: emailNorm, phone: phone.trim(), hash, salt, createdAt });
  const token = await createSession(id, 'user');
  res.status(201).json({ token, user: userPublic({ id, name: name.trim(), email: emailNorm, phone: phone.trim(), createdAt }) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const emailNorm = String(email || '').trim().toLowerCase();
  const user = await getUserByEmail(emailNorm);
  if (!user || !verifyPassword(password, user.passHash, user.passSalt)) return res.status(401).json({ error: 'Incorrect email or password.' });
  const token = await createSession(user.id, 'user');
  res.json({ token, user: userPublic(user) });
});

app.post('/api/auth/logout', requireUser, async (req, res) => { await destroySession(tokenFromReq(req)); res.status(204).end(); });

app.get('/api/auth/me', requireUser, async (req, res) => {
  const user = await getUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: userPublic(user) });
});

// ---------- customers (admin) ----------
app.get('/api/users', requireAdmin, async (req, res) => res.json((await listUsers()).map(userPublic)));

// ---------- orders ----------
app.get('/api/orders', requireAdmin, async (req, res) => res.json(await listOrders()));
app.get('/api/orders/mine', requireUser, async (req, res) => res.json(await listOrdersByUser(req.userId)));

app.get('/api/orders/find', async (req, res) => {
  const { id, phone } = req.query;
  const order = await getOrderById(String(id || '').trim());
  if (!order || order.customer.phone.replace(/\s+/g, '') !== String(phone || '').replace(/\s+/g, '')) {
    return res.status(404).json({ error: 'No order found with that ID and phone number.' });
  }
  res.json(order);
});

app.get('/api/orders/:id', async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
});

app.patch('/api/orders/:id/status', requireAdmin, async (req, res) => {
  const existing = await getOrderById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Order not found.' });
  res.json(await updateOrderStatusRow(req.params.id, req.body.status));
});

app.post('/api/orders', optionalUser, async (req, res) => {
  const { items, customer, payment } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Cart is empty.' });
  if (!customer?.name || !customer?.phone || !customer?.address || !customer?.division) return res.status(400).json({ error: 'Missing delivery details.' });

  const settings = await getSettings();
  const resolved = [];
  for (const it of items) {
    const product = await getProductById(Number(it.id));
    if (!product) return res.status(400).json({ error: `Product ${it.id} no longer exists.` });
    if (product.sold) return res.status(409).json({ error: `${product.name} is sold out.` });
    const qty = Math.max(1, Number(it.qty) || 1);
    if (product.stock < qty) return res.status(409).json({ error: `Only ${product.stock} left in stock for ${product.name}.` });
    resolved.push({ product, qty });
  }

  const subtotal = resolved.reduce((a, r) => a + r.product.price * r.qty, 0);
  const freeShip = subtotal >= settings.freeShipThreshold;
  const delivery = freeShip ? 0 : (customer.division === 'Dhaka' ? settings.shipDhaka : settings.shipOutside);
  const total = subtotal + delivery;
  const id = 'GE-' + Math.floor(100000 + Math.random() * 900000);
  const createdAt = new Date().toISOString();
  const orderItems = resolved.map(r => ({ id: r.product.id, name: r.product.name, brand: r.product.brand, price: r.product.price, qty: r.qty, image: r.product.image || '', cat: r.product.cat }));
  const stockUpdates = resolved.map(r => { const stock = r.product.stock - r.qty; return { id: r.product.id, stock, sold: stock <= 0 }; });

  try {
    const order = await placeOrderTx({
      order: { id, userId: req.userId || null, items: orderItems, customer, subtotal, delivery, total, payment, status: 'Pending', createdAt },
      stockUpdates,
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: 'Could not place order. Please try again.' });
  }
});

export default app;
