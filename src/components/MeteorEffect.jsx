import React from 'react';

// Stable across re-renders (computed once at module load), but still looks organic.
// One slot per equal-width band across the full page, jittered within the band —
// pure random placement at this low a count tends to cluster and leave empty gaps.
const COUNT = 14;
const BAND = 100 / COUNT;
const DROPS = Array.from({ length: COUNT }, (_, i) => ({
  left: BAND * i + Math.random() * BAND,
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
