import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useGetFilterOptionsQuery } from '@/redux/api/apiSlice';

/* ------------------ Config & helpers ------------------ */
const FILTERS = [
  { key: 'category',     label: 'Category',     api: 'category/' },
  { key: 'color',        label: 'Color',        api: 'color/' },
  { key: 'content',      label: 'Content',      api: 'content/' },
  { key: 'design',       label: 'Design',       api: 'design/' },

  { key: 'structure',    label: 'Structure',    api: 'structure/',
    sub: { key: 'substructure', label: 'Sub-structure', api: 'substructure/' } },

  { key: 'finish',       label: 'Finish',       api: 'finish/',
    sub: { key: 'subfinish', label: 'Sub-finish', api: 'subfinish/' } },

  { key: 'suitablefor',  label: 'Suitable For', api: 'suitablefor/',
    sub: { key: 'subsuitable', label: 'Sub-suitable', api: 'subsuitable/' } },

  { key: 'motifsize',    label: 'Motif Size',   api: 'motif/' },
];

const getOptions = (d = []) =>
  (Array.isArray(d) ? d : d?.data ?? d?.results ?? d?.items ?? d?.docs ?? []);
const getNameAndValue = (o) => {
  const value = o?._id ?? o?.id ?? o?.value ?? o?.slug ?? o?.name;
  const name  = o?.name ?? o?.parent ?? o?.title ?? String(value);
  return { value: String(value), name: String(name) };
};

/* =======================================================
   MAIN
======================================================= */
const ShopSidebarFilters = ({ onFilterChange, selected = {}, hideTitle = false }) => {
  const sidebarRef = useRef(null);
  const [activePanel, setActivePanel] = useState(null);
  const [panelPos, setPanelPos] = useState({ left: 420, top: 80, maxHeight: 560 });

  // Measure left from sidebar; top comes from clicked row
  const measureLeft = () => {
    const el = sidebarRef.current;
    const rect = el?.getBoundingClientRect();
    if (rect) {
      const left = Math.round(rect.right + 24);
      setPanelPos((p) => ({ ...p, left }));
    }
  };

  useEffect(() => {
    measureLeft();
    const onResize = () => measureLeft();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // body lock + ESC close
  useEffect(() => {
    if (!activePanel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setActivePanel(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [activePanel]);

  // open panel and align vertically just BELOW the clicked row
  const openFor = (filter, rowEl) => {
    const rect = rowEl?.getBoundingClientRect?.();
    const margin = 16;                              // viewport padding
    const idealTop = rect ? rect.top + 12 : 32;     // nudge down like your ref
    const maxH = window.innerHeight - margin * 2;
    const clampedTop = Math.max(margin, Math.min(idealTop, window.innerHeight - margin - 400));
    setPanelPos((p) => ({ ...p, top: clampedTop, maxHeight: maxH }));
    setActivePanel(filter);
  };

  const handleTick = (filterKey, value) => {
    const cur  = Array.isArray(selected[filterKey]) ? selected[filterKey] : [];
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    onFilterChange({ ...selected, [filterKey]: next });
  };

  const clearSection = (filterKey) => {
    const next = { ...selected };
    delete next[filterKey];
    onFilterChange(next);
  };

  return (
    <div className="tp-shop-sidebar sidebar-card" ref={sidebarRef}>
      {!hideTitle && <h3 className="sidebar-title">Filter</h3>}
      <div className="sidebar-scroll">
        {FILTERS.map((f) => {
          const count = Array.isArray(selected[f.key]) ? selected[f.key].length : 0;
          return (
            <div key={f.key} className="tp-shop-widget">
              <button
                type="button"
                className="filter-row"
                onClick={(e) => openFor(f, e.currentTarget)}
                aria-haspopup="dialog"
                aria-expanded={!!activePanel && activePanel.key === f.key}
              >
                <span className="filter-row__label">{f.label}</span>
                <span className="filter-row__actions">
                  {!!count && <span className="pill-count">{count}</span>}
                  <Chevron right />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {activePanel && (
        <FilterFlyout
          anchorLeft={panelPos.left}
          anchorTop={panelPos.top}
          maxHeight={panelPos.maxHeight}
          filter={activePanel}
          selected={selected}
          onTick={handleTick}
          onClear={() => clearSection(activePanel.key)}
          onClose={() => setActivePanel(null)}
        />
      )}

      <style jsx global>{`
        .sidebar-card{
          --ink:#0f172a; --muted:#6b7280; --line:rgba(15,23,42,.12);
          background:#fff; border:1px solid var(--line); border-radius:16px;
          padding:16px; box-shadow:0 1px 2px rgba(0,0,0,.04);
          font-family: 'Jost', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .sidebar-title{ margin:4px 4px 12px; font:700 16px/1.2 'Jost', system-ui, sans-serif; color:var(--ink); }
        .sidebar-scroll{
          max-height: calc(100vh - var(--header-offset, 88px) - 110px);
          overflow:auto; padding-right:6px;
        }
        .sidebar-scroll::-webkit-scrollbar{ width:10px; }
        .sidebar-scroll::-webkit-scrollbar-thumb{ background:#e5e7eb; border-radius:8px; }
        .filter-row{
          width:100%; display:flex; align-items:center; justify-content:space-between;
          padding:12px 12px; margin:8px 0 6px;
          border:1px solid var(--line); border-radius:12px; background:#fff;
          cursor:pointer; transition:background .15s, border-color .15s, transform .12s ease;
        }
        .filter-row:hover{ background:#f9fafb; border-color:rgba(15,23,42,.18); transform:translateY(-1px); }
        .filter-row__label{ font:700 15px/1.2 'Jost', system-ui, sans-serif; color:#0f172a; }
        .filter-row__actions{ display:flex; align-items:center; gap:10px; }
        .pill-count{ min-width:24px; height:22px; padding:0 8px; border-radius:999px; background:#0b1b2b; color:#fff; font:700 12px/22px 'Jost', system-ui, sans-serif; text-align:center; }
      `}</style>
    </div>
  );
};

/* =======================================================
   Flyout Panel (search removed; smooth animations)
======================================================= */
const FilterFlyout = ({ anchorLeft, anchorTop, maxHeight, filter, selected, onTick, onClear, onClose }) => {
  const panelRef = useRef(null);
  const [ddOpen, setDdOpen] = useState(false);   // dropdown open/close
  const [subOpen, setSubOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // for entrance animation

  const { data, isLoading, error } = useGetFilterOptionsQuery(filter.api, { skip: !filter });
  const options = getOptions(data);

  // click outside closes panel
  useEffect(() => {
    const onDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', onDown);
    setMounted(true);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose]);

  const selectedArr = Array.isArray(selected[filter.key]) ? selected[filter.key] : [];
  const toggleDropdown = () => setDdOpen((v) => !v);
  const ddMaxHeight = 320;

  return createPortal(
    <>
      {/* Dim backdrop */}
      <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.08)', backdropFilter:'saturate(120%) blur(1px)', zIndex: 40 }} />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`filter-panel ${mounted ? 'enter' : ''}`}
        style={{
          position:'fixed',
          left: Math.max(12, anchorLeft),
          top: anchorTop,
          width: 500,
          maxWidth: '92vw',
          maxHeight,
          background:'#fff',
          borderRadius:16,
          boxShadow:'0 20px 50px rgba(0,0,0,.15)',
          zIndex: 41,
          display:'flex',
          flexDirection:'column',
          overflow:'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding:'18px 20px 12px', borderBottom:'1px solid rgba(15,23,42,.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontWeight:700, fontSize:16 }}>{filter.label}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="x-btn"
            title="Close"
          >
            {/* small close icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'16px 20px 12px' }}>
          <div style={{ fontWeight:700, color:'#64748b', fontSize:14, marginBottom:8 }}>{filter.label}</div>

          {/* SELECT-like control */}
          <div
            className={`fake-select ${ddOpen ? 'open' : ''}`}
            onClick={toggleDropdown}
            aria-expanded={ddOpen}
            style={{
              position:'relative',
              border:'1px solid rgba(15,23,42,.18)', borderRadius:12,
              padding:'12px 14px',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              cursor:'pointer', background:'#fff'
            }}
          >
            <span style={{ color:selectedArr.length ? '#0f172a' : '#94a3b8' }}>
              {selectedArr.length ? `${selectedArr.length} selected` : `Select ${filter.label}`}
            </span>
            <Chevron down className={`chev-rot ${ddOpen ? 'rot' : ''}`} />

            {/* Dropdown list */}
            {ddOpen && (
              <div
                className="dropdown-anim"
                style={{
                  position:'absolute', left:0, right:0, top:'calc(100% + 8px)',
                  background:'#fff', border:'1px solid rgba(15,23,42,.12)', borderRadius:12,
                  boxShadow:'0 10px 30px rgba(0,0,0,.12)', zIndex: 42
                }}
              >
                <div style={{ maxHeight: ddMaxHeight, overflow:'auto', padding:'6px 8px 8px' }}>
                  {isLoading && <div className="small text-muted" style={{ padding:'10px' }}>Loading…</div>}
                  {error && <div className="small text-danger" style={{ padding:'10px' }}>Error loading</div>}
                  {!isLoading && !error && options.map((o) => {
                    const { value, name } = getNameAndValue(o);
                    const checked = selectedArr.includes(value);
                    return (
                      <label key={value} className="option-item" style={{ margin:'2px 4px' }}>
                        <input type="checkbox" checked={checked} onChange={() => onTick(filter.key, value)} />
                        <span className="label">{name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Optional sub-filter */}
          {filter.sub && (
            <div style={{ marginTop:14 }}>
              <div className="sub-head" style={{ cursor:'pointer' }} onClick={() => setSubOpen(v => !v)}>
                <span>{filter.sub.label}</span>
                <Chevron right className={subOpen ? 'chev-rot rot' : 'chev-rot'} />
              </div>
              {subOpen && (
                <div className="sub-body">
                  <SubFilter
                    api={filter.sub.api}
                    filterKey={filter.sub.key}
                    selected={selected[filter.sub.key] ?? []}
                    onSelect={onTick}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop:'auto', padding:'14px 20px', borderTop:'1px solid rgba(15,23,42,.08)', display:'flex', gap:12 }}>
          <button
            type="button"
            onClick={onClear}
            className="link-clear"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-confirm"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* cosmetics & animations */}
      <style jsx global>{`
        .x-btn{ border:0; background:transparent; cursor:pointer; padding:6px; border-radius:8px; transition:background .15s ease; }
        .x-btn:hover{ background:#fff1f1; }

        .option-item{
          display:flex; align-items:center; gap:10px;
          padding:11px 10px; border-radius:10px; cursor:pointer;
          transition: background .12s ease;
        }
        .option-item:hover{ background:#f8fafc; }
        .option-item .label{ color:#0f172a; font:600 14px/1.25 'Jost', system-ui, sans-serif; }
        .option-item input[type="checkbox"]{
          appearance:none; width:18px; height:18px; border:1.5px solid rgba(15,23,42,.22);
          border-radius:6px; background:#fff; display:grid; place-items:center;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .option-item input[type="checkbox"]:focus-visible{ outline:none; box-shadow:0 0 0 3px rgba(37,99,235,.15); }
        .option-item input[type="checkbox"]::after{
          content:""; width:10px; height:10px; transform:scale(0) rotate(45deg);
          border-right:2px solid #fff; border-bottom:2px solid #fff; transition:transform .16s ease-in-out;
        }
        .option-item input[type="checkbox"]:checked{ border-color:#0b1b2b; background:#0b1b2b; }
        .option-item input[type="checkbox"]:checked::after{ transform:scale(1) rotate(45deg); }

        .chev-rot{ transition: transform .18s ease; }
        .chev-rot.rot{ transform: rotate(180deg); }

        .btn-confirm{
          margin-left:auto; height:46px; min-width:156px; padding:0 18px;
          border-radius:999px; border:1px solid #0b1b2b; background:#0b1b2b;
          color:#fff; font:700 15px/46px 'Jost', system-ui, sans-serif; letter-spacing:.2px;
          box-shadow:0 6px 14px rgba(11,27,43,.18);
          transition: transform .08s ease, box-shadow .15s ease, background .15s ease;
        }
        .btn-confirm:hover{ box-shadow:0 10px 22px rgba(11,27,43,.24); }
        .btn-confirm:active{ transform: translateY(1px); }

        .link-clear{
          border:0; background:transparent; color:#2563eb; font:700 13px 'Jost', system-ui, sans-serif;
          padding:8px 10px; border-radius:10px; transition: background .15s ease;
        }
        .link-clear:hover{ background:#eef2ff; }

        /* Panel entrance */
        .filter-panel{ opacity:0; transform: translateY(8px); transition: opacity .18s ease, transform .18s ease; }
        .filter-panel.enter{ opacity:1; transform: translateY(0); }

        /* Dropdown pop animation */
        .dropdown-anim{ animation: ddIn .14s ease-out; transform-origin: top center; }
        @keyframes ddIn{
          0%{ opacity:0; transform: translateY(-6px) scale(.98); }
          100%{ opacity:1; transform: translateY(0) scale(1); }
        }

        .sub-head{
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 6px 6px; margin-top:6px; font:700 13px/1.2 'Jost', system-ui, sans-serif; color:#0f172a;
        }
        .sub-body{ padding-left:12px; border-left:2px solid rgba(15,23,42,.12); margin-left:6px; }
      `}</style>
    </>,
    document.body
  );
};

/* SubFilter (unchanged logic) */
const SubFilter = ({ api, filterKey, selected, onSelect }) => {
  const { data, isLoading, error } = useGetFilterOptionsQuery(api);
  const options = getOptions(data);

  if (isLoading) return <div className="small text-muted" style={{ padding:'8px 6px' }}>Loading…</div>;
  if (error)     return <div className="small text-danger" style={{ padding:'8px 6px' }}>Error</div>;
  if (!options.length) return <div className="small text-muted" style={{ padding:'8px 6px' }}>No options</div>;

  return (
    <div>
      {options.map((o) => {
        const { value, name } = getNameAndValue(o);
        const checked = Array.isArray(selected) && selected.includes(value);
        return (
          <label key={value} className="option-item" style={{ margin:'2px 0' }}>
            <input type="checkbox" checked={!!checked} onChange={() => onSelect(filterKey, value)} />
            <span className="label">{name}</span>
          </label>
        );
      })}
    </div>
  );
};

/* ---------- Tiny SVG chevron (nice + crisp) ---------- */
function Chevron({ down, right, className = '' }) {
  const rotate = down ? 0 : right ? 90 : 0;
  return (
    <svg
      className={className}
      width="18" height="18" viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default ShopSidebarFilters;
