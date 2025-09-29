'use client';
import React from 'react';

export default function EmptyState({
  title    = 'No products match your filters',
  subtitle = 'Try adjusting your filters or explore more categories.',
  className = '',
  size = 'lg', // 'sm' | 'md' | 'lg'
  palette = {
    ink:        '#111827', // title + icon strokes (near black)
    muted:      '#6b7280', // subtitle gray
    accentFrom: '#7c3aed', // purple
    accentTo:   '#06b6d4', // cyan
    skin:       '#f2b7a3',
    hair:       '#0f172a',
    cloth:      '#e0f2fe', // light fabric fill
  },
}) {
  return (
    <div className={`es-empty ${className}`} data-size={size} role="status" aria-live="polite">
      {/* Weaver + loom icon (refined) */}
      <div className="es-icon" aria-hidden>
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          <defs>
            <linearGradient id="loomGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={palette.accentFrom}/>
              <stop offset="1" stopColor={palette.accentTo}/>
            </linearGradient>
            <radialGradient id="halo" cx="50%" cy="45%" r="60%">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.95"/>
              <stop offset="70%" stopColor="#e6f4ff" stopOpacity="0.75"/>
              <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.6"/>
            </radialGradient>
          </defs>

          {/* soft gradient halo */}
          <circle cx="64" cy="64" r="42" fill="url(#halo)" />
          <circle cx="64" cy="64" r="46" fill="none" stroke="url(#loomGrad)" strokeOpacity=".45" strokeWidth="6"/>

          {/* loom frame */}
          <rect x="54" y="30" width="56" height="60" rx="8" ry="8"
                fill={palette.cloth} stroke={palette.ink} strokeWidth="3.5" />

          {/* warp (vertical threads) */}
          <path d="M60 34v52 M68 34v52 M76 34v52 M84 34v52 M92 34v52 M100 34v52"
                stroke={palette.ink} strokeOpacity=".30" strokeWidth="2.5" strokeLinecap="round"/>

          {/* weft (colored) */}
          <path d="M58 50h50 M58 62h50 M58 74h50"
                stroke="url(#loomGrad)" strokeWidth="4" strokeLinecap="round"/>

          {/* stitched border on fabric panel */}
          <rect x="57" y="45" width="50" height="30" rx="5" ry="5"
                fill="none" stroke="url(#loomGrad)" strokeDasharray="3 3" strokeWidth="2" />

          {/* shuttle */}
          <rect x="68" y="58" width="18" height="6" rx="3"
                fill="url(#loomGrad)" stroke={palette.ink} strokeWidth="2"/>

          {/* girl */}
          {/* head */}
          <circle cx="30" cy="44" r="8" fill={palette.skin} stroke={palette.ink} strokeWidth="2.4"/>
          {/* bun + hair */}
          <circle cx="34" cy="36" r="4" fill={palette.hair} stroke={palette.ink} strokeWidth="1.6"/>
          <path d="M22 44c3-4 13-4 16 0" stroke={palette.hair} strokeWidth="2.6" fill="none" strokeLinecap="round"/>

          {/* body & seat */}
          <path d="M24 70c0-10 12-14 18-10l6 4" fill="none" stroke={palette.ink} strokeWidth="2.6" strokeLinecap="round"/>
          <rect x="18" y="80" width="22" height="6" rx="3" fill="none" stroke={palette.ink} strokeWidth="2.6"/>

          {/* arms to loom (with outline for clarity) */}
          <path d="M36 54 L54 60" stroke={palette.skin} strokeWidth="5.2" strokeLinecap="round"/>
          <path d="M34 60 L54 68" stroke={palette.skin} strokeWidth="5.2" strokeLinecap="round"/>
          <path d="M36 54 L54 60 M34 60 L54 68" stroke={palette.ink} strokeOpacity=".28" strokeWidth="1.6" strokeLinecap="round"/>

          {/* hands */}
          <circle cx="54" cy="60" r="2.6" fill={palette.skin} stroke={palette.ink} strokeWidth="1.4"/>
          <circle cx="54" cy="68" r="2.6" fill={palette.skin} stroke={palette.ink} strokeWidth="1.4"/>

          {/* small thread flourish */}
          <path d="M44 72q8 6 16 2" fill="none" stroke="url(#loomGrad)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <h3 className="es-title">{title}</h3>
      {subtitle ? <p className="es-sub">{subtitle}</p> : null}

      <style jsx>{`
        .es-empty{
          width:100%;
          text-align:center;
          display:grid;
          place-items:center;
          gap:10px;
          padding:6px;
        }
        /* sizes */
        .es-empty[data-size="sm"] { --icon: 64px; --title: 18px; --sub: 14px; }
        .es-empty[data-size="md"] { --icon: 84px; --title: 20px; --sub: 15px; }
        .es-empty[data-size="lg"] { --icon: 127px; --title: 22px; --sub: 16px; }

        .es-icon{ width:var(--icon); height:var(--icon); margin-bottom:6px; }

        .es-title{
          margin:0;
          font-weight:800;
          font-size:var(--title);
          color:${palette.ink};   /* crisp blackish */
          letter-spacing:.2px;
        }
        .es-sub{
          margin:0;
          color:${palette.muted}; /* readable gray */
          font-size:var(--sub);
        }

        @media (prefers-color-scheme: dark){
          .es-title{ color:#010f1cc4; }
          .es-sub{ color:blue; }
        }
      `}</style>
    </div>
  );
}
