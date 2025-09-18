import React, { useState, useEffect, useMemo } from 'react';
import { useGetFilterOptionsQuery } from '@/redux/api/apiSlice';

const FILTERS = [
  { key: 'category',     label: 'Category',     api: 'category/' },
  { key: 'color',        label: 'Color',        api: 'color/' },
  { key: 'content',      label: 'Content',      api: 'content/' },
  { key: 'design',       label: 'Design',       api: 'design/' },
  {
    key: 'structure', label: 'Structure', api: 'substructure/',
    sub: { key: 'substructure', label: 'Sub-structure', api: 'substructure/' }
  },
  {
    key: 'finish', label: 'Finish', api: 'subfinish/',
    sub: { key: 'subfinish', label: 'Sub-finish', api: 'subfinish/' }
  },
  {
    key: 'suitablefor', label: 'Suitable For', api: 'subsuitable/',
    sub: { key: 'subsuitable', label: 'Sub-suitable', api: 'subsuitable/' }
  },
  { key: 'motifsize', label: 'Motif Size', api: 'motif/' },
];

const getOptions = (d = []) =>
  Array.isArray(d) ? d : d?.data ?? d?.results ?? d?.items ?? d?.docs ?? [];

const getNameAndValue = (o) => {
  const value = o?._id ?? o?.id ?? o?.value ?? o?.slug ?? o?.name;
  const name  = o?.name ?? o?.parent ?? o?.title ?? String(value);
  return { value: String(value), name: String(name) };
};

const ShopSidebarFilters = ({ onFilterChange, selected = {}, hideTitle = false }) => {
  const [open, setOpen]       = useState(null);
  const [openSub, setOpenSub] = useState({});

  // single-open accordion behavior already handled
  const toggle    = (key)        => setOpen(k => (k === key ? null : key));
  const toggleSub = (p, s)       => setOpenSub(o => ({ ...o, [p]: o[p] === s ? null : s }));

  const handleTick = (filterKey, value) => {
    const cur = Array.isArray(selected[filterKey]) ? selected[filterKey] : [];
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
    onFilterChange({ ...selected, [filterKey]: next });
  };

  const clearSection = (filterKey) => {
    const next = { ...selected };
    delete next[filterKey];
    onFilterChange(next);
  };

  return (
    <div className="tp-shop-sidebar sidebar-accordion mr-10">
      {!hideTitle && <h3 className="sidebar-title">Filters</h3>}

      {/* scrollable area so the last filters are always reachable */}
      <div className="sidebar-scroll">
        {FILTERS.map(f => (
          <FilterSection
            key={f.key}
            filter={f}
            isOpen={open === f.key}
            expandedSub={openSub[f.key]}
            selected={selected}
            onToggle={() => toggle(f.key)}
            onToggleSub={() => toggleSub(f.key, f.sub?.key)}
            onCheckbox={handleTick}
            onClear={() => clearSection(f.key)}
          />
        ))}
      </div>

      <style jsx global>{`
        /* container */
        .sidebar-accordion{
          --ink:#0f172a; --muted:#6b7280; --accent:#7c3aed;
          --border:rgba(15,23,42,.14);
          background:#fff;
          border-radius:16px;
          padding:22px 20px;
          box-shadow:0 1px 2px rgba(0,0,0,.04);
          display:flex; flex-direction:column;
          position:relative;
        }
        .sidebar-title{
          margin:0; padding:6px 2px 12px;
          font-size:16px; font-weight:800; color:var(--ink);
          border-bottom:1px solid rgba(15,23,42,.10);
        }

        /* make the list scroll within the viewport */
        .sidebar-scroll{
          overflow:auto;
          max-height:calc(100vh - 140px); /* adjust if your header is taller/shorter */
          padding-top:6px;
        }
        .sidebar-scroll::-webkit-scrollbar{ width:10px; }
        .sidebar-scroll::-webkit-scrollbar-thumb{ background:#e5e7eb; border-radius:8px; }

        /* === SECTION (divider-only look, like your 2nd screenshot) === */
        .tp-shop-widget{ margin:0; }
        .filter-head{
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 4px;
          cursor:pointer; user-select:none;
          color:var(--ink);
          font-weight:700; font-size:15px;
        }
        .filter-divider{ height:1px; background:rgba(15,23,42,.12); margin:4px 0 6px; }

        .filter-actions{ display:flex; align-items:center; gap:10px; }
        .filter-clear{
          border:0; background:transparent; color:#2563eb; font-weight:700; font-size:12px; padding:0; cursor:pointer;
        }

        /* chevron */
        .chev{ width:18px; height:18px; display:grid; place-items:center; color:var(--muted); transform:rotate(0deg); transition:transform .2s ease; }
        .chev.open{ transform:rotate(180deg); }

        /* smooth collapsing via the "grid row" trick */
        .collapsible{ display:grid; grid-template-rows:0fr; transition:grid-template-rows .25s ease; }
        .collapsible.open{ grid-template-rows:1fr; }
        .collapsible__inner{ overflow:hidden; }

        /* body */
        .tp-shop-widget-options{ padding:6px 0 10px; }
        .option-item{
          display:flex; align-items:center; gap:10px;
          padding:8px 2px; border-radius:8px; cursor:pointer;
          transition:background .2s ease;
        }
        .option-item:hover{ background:#f9fafb; }
        .option-item .label{ color:var(--ink); font-size:14px; line-height:1.2; }

        /* custom checkbox */
        .option-item input[type="checkbox"]{
          appearance:none; width:18px; height:18px; border:1.5px solid rgba(15,23,42,.2);
          border-radius:6px; background:#fff; display:grid; place-items:center;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .option-item input[type="checkbox"]:focus-visible{ outline:none; box-shadow:0 0 0 3px rgba(124,58,237,.15); }
        .option-item input[type="checkbox"]::after{
          content:""; width:10px; height:10px; transform:scale(0) rotate(45deg);
          border-right:2px solid #fff; border-bottom:2px solid #fff; transition:transform .18s ease-in-out;
        }
        .option-item input[type="checkbox"]:checked{ border-color:var(--accent); background:var(--accent); }
        .option-item input[type="checkbox"]:checked::after{ transform:scale(1) rotate(45deg); }

        /* sub-filter */
        .sub-head{
          display:flex; align-items:center; justify-content:space-between;
          padding:8px 2px; margin-top:6px; font-size:13px; font-weight:700; color:var(--ink);
        }
        .sub-body{ padding-left:12px; border-left:2px solid rgba(15,23,42,.12); margin-left:4px; }

        .small.text-muted{ color:#6b7280 !important; }
        .small.text-danger{ color:#ef4444 !important; }
      `}</style>
    </div>
  );
};

const FilterSection = ({
  filter, isOpen, expandedSub, selected,
  onToggle, onToggleSub, onCheckbox, onClear
}) => {
  const { data, isLoading, error } = useGetFilterOptionsQuery(filter.api, {
    skip: !isOpen && !expandedSub,
  });
  const options = getOptions(data);

  // simple per-section search (optional; keeps height compact)
  const [q, setQ] = useState('');
  useEffect(() => { if (!isOpen) setQ(''); }, [isOpen]);

  const filtered = useMemo(() => {
    if (!q) return options;
    const needle = q.toLowerCase();
    return options.filter((o) => {
      const { name, value } = getNameAndValue(o);
      return name.toLowerCase().includes(needle) || String(value).toLowerCase().includes(needle);
    });
  }, [q, options]);

  const selectedCount = Array.isArray(selected[filter.key]) ? selected[filter.key].length : 0;

  return (
    <div className="tp-shop-widget">
      <div className="filter-head" onClick={onToggle} role="button" aria-expanded={isOpen}>
        <span>{filter.label}</span>
        <div className="filter-actions" onClick={(e)=>e.stopPropagation()}>
          {!!selectedCount && (
            <button type="button" className="filter-clear" onClick={onClear} aria-label="Clear section">
              Clear
            </button>
          )}
          <span className={`chev ${isOpen ? 'open' : ''}`}>⌃</span>
        </div>
      </div>

      {/* divider like screenshot #2 */}
      <div className="filter-divider" />

      <div className={`collapsible ${isOpen ? 'open' : ''}`}>
        <div className="collapsible__inner">
          <div className="tp-shop-widget-options">
            {/* small search row; remove if not needed */}
            <div style={{ display:'flex', margin:'0 0 8px' }}>
              <input
                type="text"
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder={`Search ${filter.label.toLowerCase()}`}
                aria-label={`Search ${filter.label}`}
                style={{
                  width:'100%', border:'1px solid rgba(15,23,42,.14)', borderRadius:10,
                  padding:'8px 12px', fontSize:13, outline:'none'
                }}
              />
            </div>

            {isLoading && <div className="small text-muted">Loading…</div>}
            {error && <div className="small text-danger">Error loading</div>}
            {!isLoading && !error && filtered.length === 0 && (
              <div className="small text-muted">No options</div>
            )}

            {!isLoading && !error && filtered.map((o) => {
              const { value, name } = getNameAndValue(o);
              const checked = (selected[filter.key] ?? []).includes(value);
              return (
                <label key={value} className="option-item">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onCheckbox(filter.key, value)}
                  />
                  <span className="label">{name}</span>
                </label>
              );
            })}

            {filter.sub && (
              <>
                <div className="sub-head" onClick={onToggleSub}>
                  <span>{filter.sub.label}</span>
                  <span className={`chev ${expandedSub ? 'open' : ''}`}>⌃</span>
                </div>

                <div className={`collapsible ${expandedSub ? 'open' : ''}`}>
                  <div className="collapsible__inner">
                    <SubFilter
                      api={filter.sub.api}
                      filterKey={filter.sub.key}
                      selected={selected[filter.sub.key] ?? []}
                      onSelect={onCheckbox}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SubFilter = ({ api, filterKey, selected, onSelect }) => {
  const { data, isLoading, error } = useGetFilterOptionsQuery(api);
  const options = getOptions(data);

  if (isLoading) return <div className="small text-muted">Loading…</div>;
  if (error)     return <div className="small text-danger">Error</div>;
  if (!options.length) return <div className="small text-muted">No options</div>;

  return (
    <div className="sub-body">
      {options.map((o) => {
        const { value, name } = getNameAndValue(o);
        const checked = selected.includes(value);
        return (
          <label key={value} className="option-item">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onSelect(filterKey, value)}
            />
            <span className="label">{name}</span>
          </label>
        );
      })}
    </div>
  );
};

export default ShopSidebarFilters;
