import pg from 'pg';
import { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '../src/data.js';

// Return BIGINT and NUMERIC as JS numbers (safe here: ids are Date.now()-based,
// well under Number.MAX_SAFE_INTEGER, and money values don't need arbitrary precision).
pg.types.setTypeParser(20, v => (v === null ? null : parseInt(v, 10)));
pg.types.setTypeParser(1700, v => (v === null ? null : parseFloat(v)));

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const q = (text, params) => pool.query(text, params);

const rowToProduct = r => r && ({
  id: r.id, brand: r.brand, name: r.name, cat: r.cat, sub: r.sub, concern: r.concern,
  price: r.price, mrp: r.mrp, rating: r.rating, reviews: r.reviews, tag: r.tag, image: r.image,
  sold: !!r.sold, stock: r.stock,
});

const seedProducts = async (client, list) => {
  await client.query('DELETE FROM products');
  for (const p of list) {
    await client.query(
      `INSERT INTO products (id, brand, name, cat, sub, concern, price, mrp, rating, reviews, tag, image, sold, stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [p.id, p.brand, p.name, p.cat, p.sub || null, p.concern || null, p.price, p.mrp, p.rating, p.reviews, p.tag || null, p.image || null, !!p.sold, p.stock ?? 100]
    );
  }
};

export async function init() {
  await q(`
    CREATE TABLE IF NOT EXISTS products (
      id BIGINT PRIMARY KEY,
      brand TEXT, name TEXT, cat TEXT, sub TEXT, concern TEXT,
      price NUMERIC, mrp NUMERIC, rating NUMERIC, reviews INTEGER,
      tag TEXT, image TEXT, sold BOOLEAN DEFAULT false, stock INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY,
      value JSONB
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      items JSONB, customer JSONB,
      subtotal NUMERIC, delivery NUMERIC, total NUMERIC,
      payment TEXT, status TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT, email TEXT UNIQUE, phone TEXT,
      pass_hash TEXT, pass_salt TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT, kind TEXT, expires_at TEXT
    );
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT, icon TEXT, tint TEXT, fg TEXT, subs JSONB, sort_order INTEGER DEFAULT 0
    );
  `);

  const { rows } = await q('SELECT COUNT(*)::int AS n FROM products');
  if (rows[0].n === 0) {
    const client = await pool.connect();
    try { await seedProducts(client, PRODUCTS); } finally { client.release(); }
  }
  const content = await getContent();
  if (content === null) await setContent(DEFAULT_CONTENT);
  const settings = await getSettings();
  if (settings === null) await setSettings(DEFAULT_SETTINGS);

  const { rows: catRows } = await q('SELECT COUNT(*)::int AS n FROM categories');
  if (catRows[0].n === 0) {
    const client = await pool.connect();
    try { await seedCategories(client, DEFAULT_CATEGORIES); } finally { client.release(); }
  }
}

const categoryRow = r => r && ({ id: r.id, name: r.name, icon: r.icon, tint: r.tint, fg: r.fg, subs: r.subs, sortOrder: r.sort_order });

const seedCategories = async (client, list) => {
  await client.query('DELETE FROM categories');
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    await client.query('INSERT INTO categories (id, name, icon, tint, fg, subs, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)', [c.id, c.name, c.icon, c.tint, c.fg, JSON.stringify(c.subs || []), i]);
  }
};

export async function listCategories() { const { rows } = await q('SELECT * FROM categories ORDER BY sort_order ASC'); return rows.map(categoryRow); }
export async function getCategoryById(id) { const { rows } = await q('SELECT * FROM categories WHERE id = $1', [id]); return categoryRow(rows[0]); }
export async function insertCategory(c) {
  const { rows } = await q('SELECT COALESCE(MAX(sort_order), -1) AS m FROM categories');
  await q('INSERT INTO categories (id, name, icon, tint, fg, subs, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)', [c.id, c.name, c.icon, c.tint, c.fg, JSON.stringify(c.subs || []), rows[0].m + 1]);
  return getCategoryById(c.id);
}
export async function updateCategory(id, patch) {
  const existing = await getCategoryById(id);
  if (!existing) return null;
  const c = { ...existing, ...patch };
  await q('UPDATE categories SET name=$1, icon=$2, tint=$3, fg=$4, subs=$5 WHERE id=$6', [c.name, c.icon, c.tint, c.fg, JSON.stringify(c.subs || []), id]);
  return getCategoryById(id);
}
export async function deleteCategoryRow(id) { await q('DELETE FROM categories WHERE id = $1', [id]); }
export async function countProductsInCategory(id) { const { rows } = await q('SELECT COUNT(*)::int AS n FROM products WHERE cat = $1', [id]); return rows[0].n; }
export async function resetCategories(seedList) {
  const client = await pool.connect();
  try { await seedCategories(client, seedList); } finally { client.release(); }
}

export async function listProducts() { const { rows } = await q('SELECT * FROM products ORDER BY id DESC'); return rows.map(rowToProduct); }
export async function getProductById(id) { const { rows } = await q('SELECT * FROM products WHERE id = $1', [id]); return rowToProduct(rows[0]); }

export async function insertProduct(p) {
  await q(
    `INSERT INTO products (id, brand, name, cat, sub, concern, price, mrp, rating, reviews, tag, image, sold, stock)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [p.id, p.brand || '', p.name || '', p.cat || 'skincare', p.sub || null, p.concern || null,
      Number(p.price) || 0, Number(p.mrp) || Number(p.price) || 0, Number(p.rating) || 4.5, Number(p.reviews) || 0,
      p.tag || null, p.image || null, !!p.sold, Number(p.stock) || 0]
  );
  return getProductById(p.id);
}

export async function updateProduct(id, patch) {
  const existing = await getProductById(id);
  if (!existing) return null;
  const p = { ...existing, ...patch };
  await q(
    `UPDATE products SET brand=$1, name=$2, cat=$3, sub=$4, concern=$5, price=$6, mrp=$7, rating=$8, reviews=$9, tag=$10, image=$11, sold=$12, stock=$13 WHERE id=$14`,
    [p.brand || '', p.name || '', p.cat || 'skincare', p.sub || null, p.concern || null,
      Number(p.price) || 0, Number(p.mrp) || Number(p.price) || 0, Number(p.rating) || 0, Number(p.reviews) || 0,
      p.tag || null, p.image || null, !!p.sold, Number(p.stock) || 0, id]
  );
  return getProductById(id);
}

export async function deleteProduct(id) { await q('DELETE FROM products WHERE id = $1', [id]); }
export async function resetProducts(seedList) {
  const client = await pool.connect();
  try { await seedProducts(client, seedList); } finally { client.release(); }
}

export async function getContent() { const { rows } = await q('SELECT value FROM kv WHERE key = $1', ['content']); return rows[0] ? rows[0].value : null; }
export async function setContent(content) { await q('INSERT INTO kv (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = excluded.value', ['content', JSON.stringify(content)]); }
export async function getSettings() { const { rows } = await q('SELECT value FROM kv WHERE key = $1', ['settings']); return rows[0] ? rows[0].value : null; }
export async function setSettings(settings) { await q('INSERT INTO kv (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = excluded.value', ['settings', JSON.stringify(settings)]); }

const userRow = r => r && ({ id: r.id, name: r.name, email: r.email, phone: r.phone, passHash: r.pass_hash, passSalt: r.pass_salt, createdAt: r.created_at });

export async function createUser(u) {
  await q('INSERT INTO users (id, name, email, phone, pass_hash, pass_salt, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)', [u.id, u.name, u.email, u.phone, u.hash, u.salt, u.createdAt]);
  return getUserById(u.id);
}
export async function getUserByEmail(email) { const { rows } = await q('SELECT * FROM users WHERE email = $1', [email]); return userRow(rows[0]) || null; }
export async function getUserById(id) { const { rows } = await q('SELECT * FROM users WHERE id = $1', [id]); return userRow(rows[0]) || null; }
export async function listUsers() { const { rows } = await q('SELECT * FROM users ORDER BY created_at DESC'); return rows.map(userRow); }

export async function createSessionRow(token, userId, kind, expiresAt) { await q('INSERT INTO sessions (token, user_id, kind, expires_at) VALUES ($1,$2,$3,$4)', [token, userId, kind, expiresAt]); }
export async function getSessionRow(token) { const { rows } = await q('SELECT * FROM sessions WHERE token = $1', [token]); if (!rows[0]) return null; const r = rows[0]; return { token: r.token, userId: r.user_id, kind: r.kind, expiresAt: r.expires_at }; }
export async function deleteSessionRow(token) { await q('DELETE FROM sessions WHERE token = $1', [token]); }

const orderFromRow = r => r && ({
  id: r.id, userId: r.user_id, items: r.items, customer: r.customer,
  subtotal: r.subtotal, delivery: r.delivery, total: r.total, payment: r.payment, status: r.status, createdAt: r.created_at,
});

export async function listOrders() { const { rows } = await q('SELECT * FROM orders ORDER BY created_at DESC'); return rows.map(orderFromRow); }
export async function listOrdersByUser(userId) { const { rows } = await q('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]); return rows.map(orderFromRow); }
export async function getOrderById(id) { const { rows } = await q('SELECT * FROM orders WHERE id = $1', [id]); return orderFromRow(rows[0]); }

export async function placeOrderTx({ order, stockUpdates }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const s of stockUpdates) {
      await client.query('UPDATE products SET stock = $1, sold = $2 WHERE id = $3', [s.stock, !!s.sold, s.id]);
    }
    await client.query(
      `INSERT INTO orders (id, user_id, items, customer, subtotal, delivery, total, payment, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [order.id, order.userId, JSON.stringify(order.items), JSON.stringify(order.customer), order.subtotal, order.delivery, order.total, order.payment, order.status, order.createdAt]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return getOrderById(order.id);
}

export async function updateOrderStatusRow(id, status) { await q('UPDATE orders SET status = $1 WHERE id = $2', [status, id]); return getOrderById(id); }
