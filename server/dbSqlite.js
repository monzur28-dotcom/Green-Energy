import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES, DEFAULT_CONCERNS, DEFAULT_BRANDS } from '../src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, 'store.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    brand TEXT, name TEXT, cat TEXT, sub TEXT, concern TEXT,
    price REAL, mrp REAL, rating REAL, reviews INTEGER,
    tag TEXT, image TEXT, sold INTEGER DEFAULT 0, stock INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT,
    itemsJson TEXT, customerJson TEXT,
    subtotal REAL, delivery REAL, total REAL,
    payment TEXT, status TEXT, createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT, email TEXT UNIQUE, phone TEXT,
    passHash TEXT, passSalt TEXT, createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    userId TEXT, kind TEXT, expiresAt TEXT
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT, icon TEXT, tint TEXT, fg TEXT, subsJson TEXT, sortOrder INTEGER DEFAULT 0
  );
`);

const kvGetRaw = (key, fallback) => {
  const row = db.prepare('SELECT value FROM kv WHERE key = ?').get(key);
  return row ? JSON.parse(row.value) : fallback;
};
const kvSetRaw = (key, value) => {
  db.prepare('INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(key, JSON.stringify(value));
};

const rowToProduct = r => r && ({ ...r, sold: !!r.sold });

const seedProducts = list => {
  db.exec('DELETE FROM products');
  const insert = db.prepare(`INSERT INTO products (id, brand, name, cat, sub, concern, price, mrp, rating, reviews, tag, image, sold, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const p of list) {
    insert.run(p.id, p.brand, p.name, p.cat, p.sub || null, p.concern || null, p.price, p.mrp, p.rating, p.reviews, p.tag || null, p.image || null, p.sold ? 1 : 0, p.stock ?? 100);
  }
};

const rowToCategory = r => r && ({ id: r.id, name: r.name, icon: r.icon, tint: r.tint, fg: r.fg, subs: JSON.parse(r.subsJson || '[]'), sortOrder: r.sortOrder });

const seedCategories = list => {
  db.exec('DELETE FROM categories');
  const insert = db.prepare('INSERT INTO categories (id, name, icon, tint, fg, subsJson, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)');
  list.forEach((c, i) => insert.run(c.id, c.name, c.icon, c.tint, c.fg, JSON.stringify(c.subs || []), i));
};

export async function init() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM products').get().n;
  if (count === 0) seedProducts(PRODUCTS);
  if (kvGetRaw('content', null) === null) kvSetRaw('content', DEFAULT_CONTENT);
  if (kvGetRaw('settings', null) === null) kvSetRaw('settings', DEFAULT_SETTINGS);
  const catCount = db.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  if (catCount === 0) seedCategories(DEFAULT_CATEGORIES);
}

export async function listCategories() { return db.prepare('SELECT * FROM categories ORDER BY sortOrder ASC').all().map(rowToCategory); }
export async function getCategoryById(id) { return rowToCategory(db.prepare('SELECT * FROM categories WHERE id = ?').get(id)); }
export async function insertCategory(c) {
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sortOrder), -1) AS m FROM categories').get().m;
  db.prepare('INSERT INTO categories (id, name, icon, tint, fg, subsJson, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(c.id, c.name, c.icon, c.tint, c.fg, JSON.stringify(c.subs || []), maxOrder + 1);
  return getCategoryById(c.id);
}
export async function updateCategory(id, patch) {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) return null;
  const c = { ...rowToCategory(existing), ...patch };
  db.prepare('UPDATE categories SET name=?, icon=?, tint=?, fg=?, subsJson=? WHERE id=?')
    .run(c.name, c.icon, c.tint, c.fg, JSON.stringify(c.subs || []), id);
  return getCategoryById(id);
}
export async function deleteCategoryRow(id) { db.prepare('DELETE FROM categories WHERE id = ?').run(id); }
export async function countProductsInCategory(id) { return db.prepare('SELECT COUNT(*) AS n FROM products WHERE cat = ?').get(id).n; }
export async function countProductsWithConcern(concern) { return db.prepare('SELECT COUNT(*) AS n FROM products WHERE concern = ?').get(concern).n; }
export async function resetCategories(seedList) { seedCategories(seedList); }

export async function listProducts() { return db.prepare('SELECT * FROM products ORDER BY id DESC').all().map(rowToProduct); }
export async function getProductById(id) { return rowToProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(id)); }

export async function insertProduct(p) {
  db.prepare(`INSERT INTO products (id, brand, name, cat, sub, concern, price, mrp, rating, reviews, tag, image, sold, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(p.id, p.brand || '', p.name || '', p.cat || 'skincare', p.sub || null, p.concern || null,
      Number(p.price) || 0, Number(p.mrp) || Number(p.price) || 0, Number(p.rating) || 4.5, Number(p.reviews) || 0,
      p.tag || null, p.image || null, p.sold ? 1 : 0, Number(p.stock) || 0);
  return getProductById(p.id);
}

export async function updateProduct(id, patch) {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return null;
  const p = { ...existing, ...patch };
  db.prepare(`UPDATE products SET brand=?, name=?, cat=?, sub=?, concern=?, price=?, mrp=?, rating=?, reviews=?, tag=?, image=?, sold=?, stock=? WHERE id=?`)
    .run(p.brand || '', p.name || '', p.cat || 'skincare', p.sub || null, p.concern || null,
      Number(p.price) || 0, Number(p.mrp) || Number(p.price) || 0, Number(p.rating) || 0, Number(p.reviews) || 0,
      p.tag || null, p.image || null, p.sold ? 1 : 0, Number(p.stock) || 0, id);
  return getProductById(id);
}

export async function deleteProduct(id) { db.prepare('DELETE FROM products WHERE id = ?').run(id); }
export async function resetProducts(seedList) { seedProducts(seedList); }
export async function renameConcernOnProducts(oldLabel, newLabel) { db.prepare('UPDATE products SET concern = ? WHERE concern = ?').run(newLabel, oldLabel); }

export async function getContent() { return kvGetRaw('content', DEFAULT_CONTENT); }
export async function setContent(content) { kvSetRaw('content', content); }
export async function getSettings() { return kvGetRaw('settings', DEFAULT_SETTINGS); }
export async function setSettings(settings) { kvSetRaw('settings', settings); }
export async function getConcerns() { return kvGetRaw('concerns', DEFAULT_CONCERNS); }
export async function setConcerns(list) { kvSetRaw('concerns', list); }
export async function getBrands() { return kvGetRaw('brands', DEFAULT_BRANDS); }
export async function setBrands(list) { kvSetRaw('brands', list); }

export async function createUser(u) {
  db.prepare('INSERT INTO users (id, name, email, phone, passHash, passSalt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(u.id, u.name, u.email, u.phone, u.hash, u.salt, u.createdAt);
  return getUserById(u.id);
}
export async function getUserByEmail(email) { return db.prepare('SELECT * FROM users WHERE email = ?').get(email) || null; }
export async function getUserById(id) { return db.prepare('SELECT * FROM users WHERE id = ?').get(id) || null; }
export async function listUsers() { return db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all(); }

export async function createSessionRow(token, userId, kind, expiresAt) { db.prepare('INSERT INTO sessions (token, userId, kind, expiresAt) VALUES (?, ?, ?, ?)').run(token, userId, kind, expiresAt); }
export async function getSessionRow(token) { return db.prepare('SELECT * FROM sessions WHERE token = ?').get(token) || null; }
export async function deleteSessionRow(token) { db.prepare('DELETE FROM sessions WHERE token = ?').run(token); }

const orderFromRow = r => r && ({
  id: r.id, userId: r.userId, items: JSON.parse(r.itemsJson), customer: JSON.parse(r.customerJson),
  subtotal: r.subtotal, delivery: r.delivery, total: r.total, payment: r.payment, status: r.status, createdAt: r.createdAt,
});

export async function listOrders() { return db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all().map(orderFromRow); }
export async function listOrdersByUser(userId) { return db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(userId).map(orderFromRow); }
export async function getOrderById(id) { return orderFromRow(db.prepare('SELECT * FROM orders WHERE id = ?').get(id)); }

export async function placeOrderTx({ order, stockUpdates }) {
  db.exec('BEGIN');
  try {
    for (const s of stockUpdates) {
      db.prepare('UPDATE products SET stock = ?, sold = ? WHERE id = ?').run(s.stock, s.sold ? 1 : 0, s.id);
    }
    db.prepare(`INSERT INTO orders (id, userId, itemsJson, customerJson, subtotal, delivery, total, payment, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(order.id, order.userId, JSON.stringify(order.items), JSON.stringify(order.customer), order.subtotal, order.delivery, order.total, order.payment, order.status, order.createdAt);
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return getOrderById(order.id);
}

export async function updateOrderStatusRow(id, status) { db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id); return getOrderById(id); }
