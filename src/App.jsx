import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import MeteorEffect from './components/MeteorEffect.jsx';
import { RequireAdmin, RequireAccount } from './components/RouteGuards.jsx';

import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import TrackOrderPage from './pages/TrackOrderPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AccountLayout from './pages/account/AccountLayout.jsx';
import ProfileTab from './pages/account/ProfileTab.jsx';
import OrdersTab from './pages/account/OrdersTab.jsx';

import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminOverviewPage from './pages/admin/AdminOverviewPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.jsx';
import AdminContentPage from './pages/admin/AdminContentPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';

// React Router doesn't reset scroll position on navigation like a full page load would.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function LoadingScreen({ error }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: '#6d766c', fontFamily: "'Inter',sans-serif", padding: 24, textAlign: 'center' }}>
      <Leaf size={32} color={error ? '#d64545' : '#14532d'} />
      <span style={{ maxWidth: 420 }}>{error || 'Loading store…'}</span>
    </div>
  );
}

function SiteLayout() {
  const { loaded, loadError } = useStore();
  if (!loaded || loadError) return <LoadingScreen error={loadError} />;
  return (
    <div className="ge-root">
      <MeteorEffect fixed />
      <Header />
      <div className="ge-main">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderConfirmationPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<RequireAccount><AccountLayout /></RequireAccount>}>
              <Route index element={<ProfileTab />} />
              <Route path="orders" element={<OrdersTab />} />
            </Route>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
