import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGetFilterOptionsQuery } from "@/redux/api/apiSlice";

/* ------------------ Config ------------------ */
const FILTERS = [
  { key: "category",    label: "Category",     api: "category/" },
  { key: "color",       label: "Color",        api: "color/" },
  { key: "content",     label: "Content",      api: "content/" },
  { key: "design",      label: "Design",       api: "design/" },

  { key: "structure",   label: "Structure",    api: "structure/",
    sub: { key: "substructure", label: "Sub-structure", api: "substructure/" } },

  { key: "finish",      label: "Finish",       api: "finish/",
    sub: { key: "subfinish", label: "Sub-finish", api: "subfinish/" } },

  { key: "suitablefor", label: "Suitable For", api: "suitablefor/",
    sub: { key: "subsuitable", label: "Sub-suitable", api: "subsuitable/" } },

  { key: "motifsize",   label: "Motif Size",   api: "motif/" },
];

export const FILTERS_MAP = Object.fromEntries(FILTERS.map(f => [f.key, f]));

const getOptions = (d = []) =>
  (Array.isArray(d) ? d : d?.data ?? d?.results ?? d?.items ?? d?.docs ?? []);

const getNameAndValue = (o) => {
  const v = o?._id ?? o?.id ?? o?.value ?? o?.slug ?? o?.name;
  const n = o?.name ?? o?.parent ?? o?.title ?? String(v);
  return { value: String(v), name: String(n) };
};

/* =======================================================
   Sidebar wrapper
======================================================= */
export default function ShopSidebarFilters({
  onFilterChange,
  selected = {},
  hideTitle = false,

  // used by mobile off-canvas to show only one filter screen
  mobile = false,
  mobileSingle = false,
  onOpenFilter, // (key) => void
}) {
  const sidebarRef = useRef(null);
  const [active, setActive] = useState(null);
  const [pos, setPos] = useState({ left: 420, top: 80, maxHeight: 560 });

  // align flyout to right of sidebar
  const measureLeft = () => {
    const r = sidebarRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos((p) => ({ ...p, left: Math.round(r.right + 24) }));
  };
  useEffect(() => {
    measureLeft();
    const onResize = () => measureLeft();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock body + ESC to close
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  // open flyout aligned just under clicked row (desktop)
  const openFor = (filter, rowEl) => {
    // mobile single-screen mode: delegate to parent
    if (mobile && mobileSingle) {
      onOpenFilter?.(filter.key);
      return;
    }
    const r = rowEl?.getBoundingClientRect?.();
    const margin = 16;
    const idealTop = r ? r.top + 12 : 32;
    const maxH = window.innerHeight - margin * 2;
    const clampedTop = Math.max(margin, Math.min(idealTop, window.innerHeight - margin - 420));
    setPos((p) => ({ ...p, top: clampedTop, maxHeight: maxH }));
    setActive(filter);
  };

  const clearKey = (key) => {
    const next = { ...selected };
    delete next[key];
    onFilterChange(next);
  };

  return (
    <div className="sidebar-card" ref={sidebarRef}>
      {!hideTitle && <h3 className="sidebar-title">Filters</h3>}
      <div className="sidebar-scroll">
        {FILTERS.map((f) => {
          const count = Array.isArray(selected[f.key]) ? selected[f.key].length : 0;
          return (
            <button
              key={f.key}
              type="button"
              className="filter-row"
              onClick={(e) => openFor(f, e.currentTarget)}
              aria-haspopup="dialog"
              aria-expanded={!!active && active.key === f.key}
            >
              <span className="filter-row__label">{f.label}</span>
              <span className="filter-row__actions">
                {!!count && <span className="pill-count">{count}</span>}
                <ChevronRight />
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <FilterFlyout
          anchorLeft={pos.left}
          anchorTop={pos.top}
          maxHeight={pos.maxHeight}
          filter={active}
          selected={selected}
          onClear={() => clearKey(active.key)}
          onClose={() => setActive(null)}
          applyDraft={(next) => { onFilterChange(next); }}
        />
      )}

      <style jsx global>{`
        .sidebar-card{
          --ink:#0f172a; --muted:#6b7280; --line:rgba(15,23,42,.12);
          --font:'Inter',system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
          background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px;
          box-shadow:0 1px 2px rgba(0,0,0,.04);font-family:var(--font);
        }
        .sidebar-title{margin:4px 4px 12px;font:600 16px/1.2 var(--font);color:#0f172a;}
        .sidebar-scroll{max-height:calc(100vh - 110px);overflow:auto;padding-right:6px;}
        .sidebar-scroll::-webkit-scrollbar{width:10px;}
        .sidebar-scroll::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:8px;}
        .filter-row{
          width:100%;display:flex;align-items:center;justify-content:space-between;
          padding:12px 12px;margin:8px 0 6px;border:1px solid var(--line);
          border-radius:12px;background:#fff;cursor:pointer;
          transition:background .15s,border-color .15s,transform .12s ease;
        }
        .filter-row:hover{background:#f9fafb;border-color:rgba(15,23,42,.18);transform:translateY(-1px);}
        .filter-row__label{font:600 15px/1.2 var(--font);color:#0f172a;}
        .filter-row__actions{display:flex;align-items:center;gap:10px;}
        .pill-count{
          min-width:22px;height:20px;padding:0 6px;border-radius:999px;background:#fee2e2;color:#b91c1c;
          font:700 12px/20px var(--font);text-align:center;
        }
      `}</style>
    </div>
  );
}

/* =======================================================
   Flyout with draft + Confirm
   (exported so OffCanvas can reuse this exact UI on mobile)
======================================================= */
export function FilterFlyout({
  anchorLeft, anchorTop, maxHeight,
  filter, selected, onClear, onClose,
  applyDraft,
  centered = false,            // when true show centered modal
  portalTarget = undefined,    // mount here instead of document.body
}) {
  const panelRef = useRef(null);
  const footerRef = useRef(null);  // measure footer top

  // draft state (applied on Confirm)
  const [draft, setDraft] = useState(() => {
    const obj = {};
    obj[filter.key] = (Array.isArray(selected[filter.key]) ? selected[filter.key] : []).map(String);
    if (filter.sub?.key) {
      obj[filter.sub.key] = (Array.isArray(selected[filter.sub.key]) ? selected[filter.sub.key] : []).map(String);
    }
    return obj;
  });

  // dropdown state
  const triggerMainRef = useRef(null);
  const [openMain, setOpenMain] = useState(false);
  const [maxHMain, setMaxHMain] = useState(320);

  const hasSub = !!filter.sub;
  const triggerSubRef = useRef(null);
  const [openSub, setOpenSub] = useState(false);
  const [maxHSub, setMaxHSub] = useState(320);

  const { data, isLoading, error } = useGetFilterOptionsQuery(filter.api, { skip: !filter });
  const options = getOptions(data);
  const { data: subData, isLoading: subLoading, error: subError } =
    useGetFilterOptionsQuery(filter.sub?.api, { skip: !hasSub });
  const subOptions = getOptions(subData);

  // click outside closes flyout
  useEffect(() => {
    const onDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  // dropdown max-height limited to footer top (Confirm always visible)
  const computeMaxHeight = (ref, setter) => {
    const r = ref.current?.getBoundingClientRect();
    const fr = footerRef.current?.getBoundingClientRect();
    if (!r || !fr) return;
    const spaceToFooter = Math.floor(fr.top - r.bottom - 12);
    const desired = 420;
    const clamped = Math.max(160, Math.min(desired, spaceToFooter));
    setter(clamped);
  };
  useEffect(() => {
    if (openMain) {
      computeMaxHeight(triggerMainRef, setMaxHMain);
      const f = () => computeMaxHeight(triggerMainRef, setMaxHMain);
      window.addEventListener("resize", f);
      window.addEventListener("scroll", f, { passive: true });
      return () => { window.removeEventListener("resize", f); window.removeEventListener("scroll", f); };
    }
  }, [openMain]);
  useEffect(() => {
    if (openSub) {
      computeMaxHeight(triggerSubRef, setMaxHSub);
      const f = () => computeMaxHeight(triggerSubRef, setMaxHSub);
      window.addEventListener("resize", f);
      window.addEventListener("scroll", f, { passive: true });
      return () => { window.removeEventListener("resize", f); window.removeEventListener("scroll", f); };
    }
  }, [openSub]);

  // draft toggle
  const toggleDraft = (key, rawValue) => {
    const value = String(rawValue);
    setDraft((d) => {
      const cur = new Set(d[key] || []);
      if (cur.has(value)) cur.delete(value); else cur.add(value)
      return { ...d, [key]: [...cur] };
    });
  };

  const valuesMain = draft[filter.key] || [];
  const valuesSub  = filter.sub?.key ? (draft[filter.sub.key] || []) : [];

  const toggleMain = () => setOpenMain((v) => !v);
  const toggleSub  = () => setOpenSub((v) => !v);

  const panelStyle = centered
    ? {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: "12vh",
        width: 520,
        maxWidth: "92vw",
        maxHeight: "76vh",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 22px 56px rgba(0,0,0,.16)",
        zIndex: 41,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Inter, system-ui",
      }
    : {
        position:"fixed",
        left: Math.max(12, anchorLeft),
        top: anchorTop,
        width: 520,
        maxWidth: "92vw",
        maxHeight,
        background:"#fff",
        borderRadius:18,
        boxShadow:"0 22px 56px rgba(0,0,0,.16)",
        zIndex: 41,
        display:"flex",
        flexDirection:"column",
        overflow:"hidden",
        fontFamily: 'Inter, system-ui'
      };

  const Backdrop = (
    <div
      style={{
        position: centered ? "absolute" : "fixed",
        inset: 0,
        background: "rgba(15,23,42,.08)",
        backdropFilter: "saturate(120%) blur(1px)",
        zIndex: 40,
      }}
    />
  );

  const Panel = (
    <div ref={panelRef} role="dialog" aria-modal="true" className="filter-panel enter" style={panelStyle}>
      {/* Header */}
      <div style={{ padding:"18px 22px 12px", borderBottom:"1px solid rgba(15,23,42,.08)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:700, fontSize:16 }}>{filter.label}</div>
        <button onClick={onClose} className="x-btn" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding:"16px 22px 12px" }}>
        {/* Main label */}
{/*         <div style={{ fontWeight:600, color:"#64748b", fontSize:14, marginBottom:8 }}>{filter.label}</div>
 */}
        {/* Main select trigger */}
        <button
          ref={triggerMainRef}
          type="button"
          className="select-trigger"
          aria-haspopup="listbox"
          aria-expanded={openMain}
          onClick={toggleMain}
          style={{
            width:"100%", textAlign:"left",
            border:"1px solid rgba(15,23,42,.18)", borderRadius:12, padding:"12px 14px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            background:"#fff", cursor:"pointer", transition:"box-shadow .15s,border-color .15s"
          }}
        >
          <span style={{ color: valuesMain.length ? "#0f172a" : "#94a3b8", fontWeight:600 }}>
            {valuesMain.length ? `${valuesMain.length} selected` : `Select ${filter.label}`}
          </span>
          <ChevronDown className={openMain ? "rot" : ""}/>
        </button>

        {/* Main dropdown menu (portal) */}
        {openMain && (
          <DropdownPortal anchorRef={triggerMainRef} maxHeight={maxHMain} portalTarget={portalTarget}>
            <MenuContent
              options={options}
              isLoading={isLoading}
              error={error}
              values={valuesMain}
              onPick={(value) => {
                toggleDraft(filter.key, value);           // toggle instantly
                setTimeout(() => setOpenMain(false), 1520); // smooth close
              }}
            />
          </DropdownPortal>
        )}

        {/* Sub section */}
        {hasSub && (
          <div style={{ marginTop:16 }}>
{/*             <div style={{ fontWeight:600, color:"#64748b", fontSize:14, marginBottom:8 }}>{filter.sub.label}</div>
 */}
            <button
              ref={triggerSubRef}
              type="button"
              className="select-trigger"
              aria-haspopup="listbox"
              aria-expanded={openSub}
              onClick={toggleSub}
              style={{
                width:"100%", textAlign:"left",
                border:"1px solid rgba(15,23,42,.18)", borderRadius:12, padding:"12px 14px",
                display:"flex", alignItems:"center", justifyContent:"space-between",
                background:"#fff", cursor:"pointer", transition:"box-shadow .15s,border-color .15s"
              }}
            >
              <span style={{ color: valuesSub.length ? "#0f172a" : "#94a3b8", fontWeight:600 }}>
                {valuesSub.length ? `${valuesSub.length} selected` : `Select ${filter.sub.label}`}
              </span>
              <ChevronDown className={openSub ? "rot" : ""}/>
            </button>

            {openSub && (
              <DropdownPortal anchorRef={triggerSubRef} maxHeight={maxHSub} >
                <MenuContent
                  options={subOptions}
                  isLoading={subLoading}
                  error={subError}
                  values={valuesSub}
                  onPick={(value) => {
                    toggleDraft(filter.sub.key, value);
                    setTimeout(() => setOpenSub(false), 1520);
                  }}
                />
              </DropdownPortal>
            )}
          </div>
        )}
      </div>

      {/* Footer (always visible; dropdown height respects this) */}
      <div
        ref={footerRef}
        style={{
          marginTop:"auto",
          padding:"14px 22px",
          borderTop:"1px solid rgba(15,23,42,.08)",
          display:"flex",
          gap:12,
          position:"relative",
          zIndex:120,
          background:"#fff"
        }}
      >
        <button type="button" onClick={onClear} className="link-clear">Clear</button>
        <button
          type="button"
          onClick={() => {
            const merged = { ...selected, ...draft };
            if (Array.isArray(merged[filter.key]) && merged[filter.key].length === 0) delete merged[filter.key];
            if (filter.sub?.key && Array.isArray(merged[filter.sub.key]) && merged[filter.sub.key].length === 0) delete merged[filter.sub.key];
            applyDraft?.(merged);
            onClose();
          }}
          className="btn-confirm"
        >
          Confirm
        </button>
      </div>
    </div>
  );

  const portalNode = portalTarget ?? document.body;

  return createPortal(
    <>
      {Backdrop}
      {Panel}
      <style jsx global>{`
        .filter-panel{opacity:0;transform:translateY(8px);transition:opacity .18s,transform .18s;}
        .filter-panel.enter{opacity:1;transform:translateY(0);}
        .x-btn{border:0;background:transparent;cursor:pointer;padding:6px;border-radius:8px;transition:background .15s;}
        .x-btn:hover{background:#fff1f1;}
        .rot{transform:rotate(180deg);transition:transform .18s ease;}
        .btn-confirm{
          margin-left:auto;height:46px;min-width:156px;padding:0 18px;border-radius:999px;
          border:1px solid #0b1b2b;background:#0b1b2b;color:#fff;font:700 15px/46px Inter,system-ui;
          box-shadow:0 6px 14px rgba(11,27,43,.18);transition:transform .08s, box-shadow .15s;
        }
        .btn-confirm:hover{box-shadow:0 10px 22px rgba(11,27,43,.24);}
        .btn-confirm:active{transform:translateY(1px);}
        .link-clear{border:0;background:transparent;color:#2563eb;font:600 13px Inter,system-ui;padding:8px 10px;border-radius:10px;}
        .link-clear:hover{background:#eef2ff;}
      `}</style>
    </>,
    portalNode
  );
}

/* ---------- Dropdown portal (positions to trigger) ---------- */
function DropdownPortal({ anchorRef, maxHeight, children, portalTarget }) {
  const [rect, setRect] = useState(null);
  const [containerRect, setContainerRect] = useState(null);
  const container = portalTarget ?? document.body;

  useEffect(() => {
    const r = anchorRef.current?.getBoundingClientRect();
    if (r) setRect(r);
    if (container && container.getBoundingClientRect) {
      setContainerRect(container.getBoundingClientRect());
    }
  }, [anchorRef, container]);

  if (!rect) return null;

  // If we're rendering inside the off-canvas wrapper, position absolutely
  const useRelative = !!portalTarget && containerRect;
  const left = useRelative ? rect.left - containerRect.left : rect.left;
  const top  = useRelative ? rect.bottom - containerRect.top + 8 : rect.bottom + 8;

  const style = {
    position: useRelative ? "absolute" : "fixed",
    left,
    top,
    width: rect.width,
    zIndex: 9999,                     // above everything in the drawer
    background: "#fff",
    border: "1px solid rgba(15,23,42,.12)",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.12)"
  };

  return createPortal(
    <div role="listbox" aria-multiselectable="true" className="dd-surface" style={style}
         onMouseDown={(e) => e.stopPropagation()}>
      <div className="dd-scroll" style={{ maxHeight, overflow: "auto", padding: "6px 8px 8px" }}>
        {children}
      </div>
      <style jsx global>{`
        .dd-scroll::-webkit-scrollbar{width:10px;}
        .dd-scroll::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:8px;}
        .dd-surface{animation:ddIn .14s ease-out;transform-origin:top center;}
        @keyframes ddIn{0%{opacity:0;transform:translateY(-6px) scale(.98);}100%{opacity:1;transform:translateY(0) scale(1);}}
      `}</style>
    </div>,
    container
  );
}


/* ---------- Dropdown menu items ---------- */
function MenuContent({ options, isLoading, error, values, onPick }) {
  if (isLoading) return <div style={{ padding:10, color:"#64748b" }}>Loading…</div>;
  if (error)     return <div style={{ padding:10, color:"#b91c1c" }}>Error loading</div>;
  if (!options?.length) return <div style={{ padding:10, color:"#64748b" }}>No options</div>;

  return (
    <>
      {options.map((o) => {
        const { value, name } = getNameAndValue(o);
        const checked = values.includes(value);
        return (
          <label
            key={value}
            className="dd-item"
            style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 10px", borderRadius:10, cursor:"pointer" }}
            onMouseDown={(e) => { e.preventDefault(); onPick(value); }}  // instant toggle + delayed close at caller
          >
            <input type="checkbox" checked={checked} readOnly className="cbx" />
            <span style={{ fontWeight:600, fontFamily:"Inter, system-ui", color:"#0f172a", lineHeight:1.35 }}>
              {name}
            </span>

            <style jsx>{`
              .dd-item:hover{ background:#f8fafc; }
              .cbx{
                appearance: none;
                width: 18px;
                height: 18px;
                border: 1.5px solid rgba(15,23,42,.22);
                border-radius: 6px;
                background: #fff;
                position: relative;
                display: inline-block;
                vertical-align: middle;
              }
              .cbx:checked{ background:#0b1b2b; border-color:#0b1b2b; }
              .cbx::after{
                content:"";
                position:absolute; left:5px; top:1px;
                width:6px; height:10px; border:2px solid #fff;
                border-top:0; border-left:0; transform: rotate(45deg);
              }
              .cbx:not(:checked)::after{ display:none; }
            `}</style>
          </label>
        );
      })}
    </>
  );
}

/* ---------- Icons ---------- */
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ChevronDown({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* =======================================================
   Single-filter helper (used by OffCanvas on mobile)
======================================================= */
export function FilterOnly({ filter, selected, onApply, onCancel, portalTarget }) {
  return (
    <FilterFlyout
      anchorLeft={0}
      anchorTop={0}
      maxHeight={Math.round(window.innerHeight * 0.72)}
      filter={filter}
      selected={selected}
      onClear={() => {
        const n = { ...selected };
        delete n[filter.key];
        if (filter.sub?.key) delete n[filter.sub.key];
        onApply(n);
      }}
      onClose={onCancel}
      applyDraft={(next) => onApply(next)}
      centered
      portalTarget={portalTarget}
    />
  );
}
