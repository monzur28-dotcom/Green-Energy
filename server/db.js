import { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES, DEFAULT_CONCERNS, DEFAULT_BRANDS } from '../src/data.js';

// DB_DRIVER=sqlite forces the local file-based database even if DATABASE_URL is set.
// Otherwise: Postgres (Supabase) is used whenever DATABASE_URL is configured, else local SQLite.
const driver = process.env.DB_DRIVER || (process.env.DATABASE_URL ? 'postgres' : 'sqlite');

const impl = driver === 'postgres' ? await import('./dbPostgres.js') : await import('./dbSqlite.js');

console.log(`[db] using ${driver} driver`);

export const {
  init, listProducts, getProductById, insertProduct, updateProduct, deleteProduct, resetProducts,
  setContent, getSettings, setSettings,
  createUser, getUserByEmail, getUserById, listUsers,
  createSessionRow, getSessionRow, deleteSessionRow,
  listOrders, listOrdersByUser, getOrderById, placeOrderTx, updateOrderStatusRow,
  listCategories, getCategoryById, insertCategory, updateCategory, deleteCategoryRow, countProductsInCategory, resetCategories,
  getConcerns, setConcerns, getBrands, setBrands, countProductsWithConcern,
} = impl;

// Merge-on-read: any content section/field added to DEFAULT_CONTENT since a database
// was first seeded automatically backfills for existing installs, without touching
// whatever the admin already customized.
export async function getContent() {
  const stored = await impl.getContent();
  if (!stored) return DEFAULT_CONTENT;
  const merged = { ...DEFAULT_CONTENT };
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    const section = stored[key];
    merged[key] = (section && typeof section === 'object' && !Array.isArray(section))
      ? { ...DEFAULT_CONTENT[key], ...section }
      : (section !== undefined ? section : DEFAULT_CONTENT[key]);
  }
  return merged;
}

export { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES, DEFAULT_CONCERNS, DEFAULT_BRANDS };
export const driverName = driver;
