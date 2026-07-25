import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="ge-wrap narrow">
      <div className="ge-emptycart">
        <Leaf size={48} color="#c7ccc2" />
        <h1 style={{ margin: '16px 0 6px', fontFamily: "'Outfit',sans-serif" }}>404 — Page not found</h1>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link className="ge-primary" style={{ maxWidth: 220, margin: '18px auto 0' }} to="/">Back to home</Link>
      </div>
    </div>
  );
}
