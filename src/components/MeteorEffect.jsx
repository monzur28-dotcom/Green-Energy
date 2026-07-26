import React from 'react';

const COLORS = ['c-blue', 'c-fire', 'c-green'];

// Stable across re-renders (computed once at module load), but still looks organic.
const METEORS = Array.from({ length: 14 }, (_, i) => ({
  left: Math.random() * 100,
  delay: -(Math.random() * 6),
  duration: 2.6 + Math.random() * 3.2,
  color: COLORS[i % COLORS.length],
}));

export default function MeteorEffect({ fixed }) {
  return (
    <div className={'ge-meteors' + (fixed ? ' fixed' : '')} aria-hidden="true">
      {METEORS.map((m, i) => (
        <span key={i} className={'ge-meteor ' + m.color} style={{ left: `${m.left}%`, animationDelay: `${m.delay}s`, animationDuration: `${m.duration}s` }} />
      ))}
    </div>
  );
}
