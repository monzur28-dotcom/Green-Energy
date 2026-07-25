import React from 'react';

// Stable across re-renders (computed once at module load), but still looks organic.
const METEORS = Array.from({ length: 14 }, () => ({
  left: Math.random() * 100,
  delay: -(Math.random() * 6),
  duration: 2.6 + Math.random() * 3.2,
}));

export default function MeteorEffect() {
  return (
    <div className="ge-meteors" aria-hidden="true">
      {METEORS.map((m, i) => (
        <span key={i} className="ge-meteor" style={{ left: `${m.left}%`, animationDelay: `${m.delay}s`, animationDuration: `${m.duration}s` }} />
      ))}
    </div>
  );
}
