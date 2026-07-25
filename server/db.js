import { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '../src/data.js';

// DB_DRIVER=sqlite forces the local file-based database even if DATABASE_URL is set.
// Otherwise: Postgres (Supabase) is used whenever DATABASE_URL is configured, else local SQLite.
const driver = process.env.DB_DRIVER || (process.env.DATABASE_URL ? 'postgres' : 'sqlite');

const impl = driver === 'postgres' ? await import('./dbPostgres.js') : await import('./dbSqlite.js');

console.log(`[db] using ${driver} driver`);

export const {
  init, listProducts, getProductById, insertProduct, updateProduct, deleteProduct, resetProducts,
  getContent, setContent, getSettings, setSettings,
  createUser, getUserByEmail, getUserById, listUsers,
  createSessionRow, getSessionRow, deleteSessionRow,
  listOrders, listOrdersByUser, getOrderById, placeOrderTx, updateOrderStatusRow,
  listCategories, getCategoryById, insertCategory, updateCategory, deleteCategoryRow, countProductsInCategory, resetCategories,
} = impl;

export { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES };
export const driverName = driver;
