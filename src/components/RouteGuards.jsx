import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';

function GuardLoading({ error }) {
  return <div style={{ textAlign: 'center', padding: 60, color: error ? 'var(--danger)' : 'var(--muted)' }}>{error || 'Loading…'}</div>;
}

export function RequireAdmin({ children }) {
  const { loaded, loadError, adminSession } = useStore();
  const location = useLocation();
  if (!loaded || loadError) return <GuardLoading error={loadError} />;
  if (!adminSession) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}

export function RequireAccount({ children }) {
  const { loaded, currentUser } = useStore();
  const location = useLocation();
  if (!loaded) return <GuardLoading />;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
