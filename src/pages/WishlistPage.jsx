import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function WishlistPage() {
  const { wishlistItems } = useStore();

  return (
    <div className="ge-wrap">
      <div className="ge-sech">Your Wishlist</div>
      <div className="ge-secsub">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</div>

      {wishlistItems.length === 0 ? (
        <div className="ge-emptycart">
          <Heart size={48} color="#c7ccc2" />
          <p style={{ marginTop: 14, fontSize: 15 }}>Nothing saved yet. Tap the heart on any product to save it here.</p>
          <Link className="ge-primary" style={{ maxWidth: 220, margin: '18px auto 0' }} to="/shop">Browse products</Link>
        </div>
      ) : (
        <div className="ge-grid">
          {wishlistItems.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
