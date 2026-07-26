import React from 'react';

// Stable across re-renders (computed once at module load), but still looks organic.
const DROPS = Array.from({ length: 14 }, () => ({
  left: Math.random() * 100,
  delay: -(Math.random() * 6),
  duration: 1 + Math.random() * 1.2,
}));

export default function MeteorEffect({ fixed }) {
  return (
    <div className={'ge-meteors' + (fixed ? ' fixed' : '')} aria-hidden="true">
      {DROPS.map((d, i) => (
        <span key={i} className="ge-meteor" style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s` }} />
      ))}
    </div>
  );
}
