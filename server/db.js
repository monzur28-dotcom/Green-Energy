import { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES, DEFAULT_CONCERNS, DEFAULT_BRANDS } from '../src/data.js';

// DB_DRIVER=sqlite forces the local file-based database even if DATABASE_URL is set.
// Otherwise: Postgres (Supabase) is used whenever DATABASE_URL is configured, else local SQLite.
const driver = process.env.DB_DRIVER || (process.env.DATABASE_URL ? 'postgres' : 'sqlite');

const impl = driver === 'postgres' ? await import('./dbPostgres.js') : await import('./dbSqlite.js');

console.log(`[db] using ${driver} driver`);

export const {
  init, listProducts, getProductById, insertProduct, updateProduct, deleteProduct, resetProducts, renameConcernOnProducts,
  setContent, setSettings,
  createUser, getUserByEmail, getUserById, listUsers,
  createSessionRow, getSessionRow, deleteSessionRow,
  listOrders, listOrdersByUser, getOrderById, placeOrderTx, updateOrderStatusRow,
  listCategories, getCategoryById, insertCategory, updateCategory, deleteCategoryRow, countProductsInCategory, resetCategories,
  getConcerns, setConcerns, getBrands, setBrands, countProductsWithConcern,
} = impl;

// Merge-on-read: any section/field added to a DEFAULTS object since a database was
// first seeded automatically backfills for existing installs, without touching
// whatever the admin already customized.
const mergeDefaults = (defaults, stored) => {
  if (!stored) return defaults;
  const merged = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const value = stored[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // drop explicit-undefined sub-keys so they fall back to defaults instead of clobbering them
      const clean = Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
      merged[key] = { ...defaults[key], ...clean };
    } else {
      merged[key] = value !== undefined ? value : defaults[key];
    }
  }
  return merged;
};

// One-time-per-read shape migration: older installs stored hero as a single shared
// caption + a plain images array. Newer code expects hero.slides[], each with its
// own image and text. This runs before mergeDefaults so it takes priority over the
// (now-empty) default slide, preserving whatever the admin already customized.
const migrateHeroContent = stored => {
  if (!stored?.hero || Array.isArray(stored.hero.slides)) return stored;
  const h = stored.hero;
  const oldImages = Array.isArray(h.images) ? h.images.filter(Boolean) : [];
  const slides = oldImages.length
    ? oldImages.map(image => ({ image, eyebrow: h.eyebrow || '', title: h.title || '', subtitle: h.subtitle || '', cta: h.cta || '' }))
    : [{ image: '', eyebrow: h.eyebrow || '', title: h.title || '', subtitle: h.subtitle || '', cta: h.cta || '' }];
  return { ...stored, hero: { overlayOpacity: h.overlayOpacity, slides } };
};

export async function getContent() { return mergeDefaults(DEFAULT_CONTENT, migrateHeroContent(await impl.getContent())); }
export async function getSettings() { return mergeDefaults(DEFAULT_SETTINGS, await impl.getSettings()); }

export { PRODUCTS, DEFAULT_CONTENT, DEFAULT_SETTINGS, DEFAULT_CATEGORIES, DEFAULT_CONCERNS, DEFAULT_BRANDS };
export const driverName = driver;
