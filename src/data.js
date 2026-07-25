// Seed data only — the live, admin-editable category list is served from the
// database via /api/categories (see StoreContext). This is just what a brand
// new database gets pre-populated with.
export const DEFAULT_CATEGORIES = [
  { id: 'makeup', name: 'Makeup', icon: 'Palette', tint: '#fdeef3', fg: '#d1568a', subs: ['Face', 'Eyes', 'Lips', 'Nails'] },
  { id: 'skincare', name: 'Skincare', icon: 'Droplet', tint: '#e9f4ee', fg: '#12805c', subs: ['Cleansers', 'Serums', 'Moisturizers', 'Sunscreen', 'Masks'] },
  { id: 'hair', name: 'Hair', icon: 'Scissors', tint: '#eef1fb', fg: '#5b6bd1', subs: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum'] },
  { id: 'body', name: 'Body & Bath', icon: 'Flower2', tint: '#fff3e6', fg: '#d98a2b', subs: ['Body Wash', 'Lotion', 'Soap'] },
  { id: 'fragrance', name: 'Fragrance', icon: 'Wind', tint: '#f2ecfb', fg: '#8b5bd1', subs: ['Men', 'Women', 'Body Mist'] },
  { id: 'baby', name: 'Baby Care', icon: 'Baby', tint: '#eaf6fb', fg: '#2f9ad1', subs: ['Baby Wash', 'Baby Lotion'] },
];
// Seed only — live editable via /api/concerns (see StoreContext).
export const DEFAULT_CONCERNS = ['Acne', 'Brightening', 'Anti-Ageing', 'Hydration', 'Sun Protection', 'Hair Fall'];

export const PRODUCTS = [
  { id: 1, brand: 'Zayn & Myza', name: 'Vitamin C Face Serum (30ml)', cat: 'skincare', sub: 'Serums', concern: 'Brightening', price: 999, mrp: 1398, rating: 4.6, reviews: 120, tag: 'Bestseller' },
  { id: 2, brand: 'The Ordinary', name: 'Niacinamide 10% + Zinc 1% (30ml)', cat: 'skincare', sub: 'Serums', concern: 'Acne', price: 1470, mrp: 2000, rating: 4.7, reviews: 89 },
  { id: 3, brand: 'CeraVe', name: 'Hydrating Cleanser (88ml)', cat: 'skincare', sub: 'Cleansers', concern: 'Hydration', price: 1091, mrp: 1150, rating: 4.8, reviews: 54 },
  { id: 4, brand: 'COSRX', name: 'Acne Pimple Master Patch (24)', cat: 'skincare', sub: 'Masks', concern: 'Acne', price: 290, mrp: 440, rating: 4.5, reviews: 210, tag: 'Hot' },
  { id: 5, brand: 'Lafz', name: 'Skin Renewal Serum Niacinamide 10% (30ml)', cat: 'skincare', sub: 'Serums', concern: 'Brightening', price: 499, mrp: 1399, rating: 4.4, reviews: 188 },
  { id: 6, brand: 'Neutrogena', name: 'Ultra Sheer Sunscreen SPF50+ (88ml)', cat: 'skincare', sub: 'Sunscreen', concern: 'Sun Protection', price: 1149, mrp: 1450, rating: 4.8, reviews: 230, sold: true },
  { id: 7, brand: 'Skin Cafe', name: 'Rosemary Essential Oil (10ml)', cat: 'hair', sub: 'Hair Oil', concern: 'Hair Fall', price: 220, mrp: 300, rating: 4.6, reviews: 145 },
  { id: 8, brand: 'Lafz', name: 'Onion Seed Oil Shampoo (200ml)', cat: 'hair', sub: 'Shampoo', concern: 'Hair Fall', price: 499, mrp: 998, rating: 4.5, reviews: 312, tag: 'Buy 1 Get 1' },
  { id: 9, brand: 'TRESemme', name: 'Keratin Smooth Conditioner (190ml)', cat: 'hair', sub: 'Conditioner', price: 249, mrp: 320, rating: 4.6, reviews: 98 },
  { id: 10, brand: 'Absolute NY', name: 'Icon Slim Matte Lipstick (1.3g)', cat: 'makeup', sub: 'Lips', price: 420, mrp: 650, rating: 4.4, reviews: 76 },
  { id: 11, brand: 'Lafz', name: 'Anti-Pollution CC Cream (30ml)', cat: 'makeup', sub: 'Face', price: 599, mrp: 1490, rating: 4.5, reviews: 143, tag: 'Bestseller' },
  { id: 12, brand: 'Absolute NY', name: 'Perfect Eyebrow Pencil (0.25g)', cat: 'makeup', sub: 'Eyes', price: 449, mrp: 640, rating: 4.3, reviews: 52, sold: true },
  { id: 13, brand: 'Vaseline', name: 'Aloe Soothe Body Lotion (400ml)', cat: 'body', sub: 'Lotion', concern: 'Hydration', price: 1070, mrp: 1500, rating: 4.6, reviews: 210 },
  { id: 14, brand: 'Zayn & Myza', name: 'Vitamin C Brightening Shower Gel (500ml)', cat: 'body', sub: 'Body Wash', price: 599, mrp: 1198, rating: 4.7, reviews: 165, tag: 'Buy 1 Get 1' },
  { id: 15, brand: 'RiBANA', name: 'Organic Goats Milk Soap (110g)', cat: 'body', sub: 'Soap', price: 570, mrp: 600, rating: 4.5, reviews: 44 },
  { id: 16, brand: "Freyia's", name: 'Neem Facewash + Moisturizer + Sunscreen Combo', cat: 'skincare', sub: 'Cleansers', price: 560, mrp: 770, rating: 4.6, reviews: 88, tag: 'Combo' },
  { id: 17, brand: 'Zayn & Myza', name: '3x Vitamin E Moisturizing Cream (50g)', cat: 'skincare', sub: 'Moisturizers', concern: 'Hydration', price: 299, mrp: 598, rating: 4.6, reviews: 220, tag: 'Buy 1 Get 1' },
  { id: 18, brand: 'WishCare', name: 'Hair Growth Concentrate Serum (30ml)', cat: 'hair', sub: 'Hair Serum', concern: 'Hair Fall', price: 1420, mrp: 1680, rating: 4.5, reviews: 60 },
  { id: 19, brand: 'Chevron', name: 'Intense EDP for Men (100ml)', cat: 'fragrance', sub: 'Men', price: 1490, mrp: 1990, rating: 4.5, reviews: 70 },
  { id: 20, brand: 'Enchanteur', name: 'Romantic Body Mist (200ml)', cat: 'fragrance', sub: 'Women', price: 690, mrp: 950, rating: 4.4, reviews: 58 },
  { id: 21, brand: 'Cetaphil Baby', name: 'Gentle Wash & Shampoo (230ml)', cat: 'baby', sub: 'Baby Wash', price: 299, mrp: 380, rating: 4.7, reviews: 95 },
  { id: 22, brand: 'Skin Cafe', name: 'Niacinamide Day Cream (50g)', cat: 'skincare', sub: 'Moisturizers', concern: 'Anti-Ageing', price: 848, mrp: 1198, rating: 4.5, reviews: 40, sold: true },
];

// Seed only — live editable via /api/brands (see StoreContext).
export const DEFAULT_BRANDS = [
  { name: 'Lafz', off: 'up to 65% off' }, { name: 'Zayn & Myza', off: 'up to 50% off' },
  { name: 'The Ordinary', off: 'up to 45% off' }, { name: 'CeraVe', off: 'up to 30% off' },
  { name: 'COSRX', off: 'up to 40% off' }, { name: 'Skin Cafe', off: 'up to 30% off' },
];

export const DIVISIONS = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh'];
export const PAYMENTS = ['Cash on Delivery', 'bKash', 'Nagad', 'SSLCommerz'];
export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const taka = n => '৳' + Number(n || 0).toLocaleString('en-US');
export const pctOff = p => (p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0);

export const DEFAULT_SETTINGS = {
  adminPin: '1234',
  freeShipThreshold: 999,
  shipDhaka: 60,
  shipOutside: 120,
  currency: '৳',
  enabledPayments: ['Cash on Delivery', 'bKash', 'Nagad', 'SSLCommerz'],
};

export const DEFAULT_CONTENT = {
  brand: { name: 'Green Energy', tagline: 'Beauty & Care' },
  nav: { home: 'Home', shop: 'Shop', trackOrder: 'Track Order' },
  search: { placeholder: 'Search brands & products — serum, sunscreen, lipstick…' },
  topbar: { promo: '🌿 100% original · clean beauty & personal care · delivery: Dhaka 2 days, outside 3–5 days', hotline: '16xxx' },
  hero: {
    eyebrow: 'Clean beauty · Big brands',
    title: 'Glow up with authentic beauty & personal care.',
    subtitle: '100% original products from the brands you love — with fast delivery and free shipping over ৳999.',
    cta: 'Shop skincare',
    images: [
      'https://picsum.photos/1200/700?random=101',
      'https://picsum.photos/1200/700?random=102',
      'https://picsum.photos/1200/700?random=103',
    ],
  },
  homepage: {
    concernLabel: 'Shop by concern',
    trustBadges: [
      { title: '100% Original', subtitle: 'Sourced directly' },
      { title: 'Free Shipping', subtitle: 'On orders over ৳999' },
      { title: 'Cash on Delivery', subtitle: 'Order now, pay later' },
      { title: 'Digital Payments', subtitle: 'bKash · Nagad · SSLCommerz' },
    ],
    brandsHeading: 'Top brands',
    brandsSubheading: 'Curated names, big savings',
  },
  footer: {
    blurb: 'Authentic, clean beauty & personal care delivered across Bangladesh. 100% original products, always.',
    address: 'House 80, Road 15, Banani, Dhaka 1213',
    phone: '+880 1XXX-XXXXXX',
    email: 'support@greenenergy.com',
    hours: 'Open daily · 8:00am – 10:00pm',
    facebook: '#', instagram: '#', youtube: '#',
    shopHeading: 'Shop', helpHeading: 'Help', contactHeading: 'Contact',
    copyrightText: 'Green Energy. All rights reserved.',
  },
};

export const blankProduct = () => ({
  id: Date.now(), brand: '', name: 'New product', cat: 'skincare', sub: '',
  price: 0, mrp: 0, rating: 4.5, reviews: 0, tag: '', concern: '', image: '', sold: false, stock: 100,
});
