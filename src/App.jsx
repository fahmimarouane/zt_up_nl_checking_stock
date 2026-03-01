import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Download, ArrowUp, ArrowDown, Zap, Menu, X, BarChart2, TrendingDown } from 'lucide-react';
import * as XLSX from 'xlsx';

/* ═══════════════════════════════════════════════════════════════
   DESIGN : "Market Intelligence Terminal" — FULLY RESPONSIVE
   Mobile-first: drawer sidebar, horizontal cat scroll, bottom nav
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:      #f5f0e8;
    --cream2:     #ede8dc;
    --cream3:     #e3ddd0;
    --ink:        #1a1612;
    --ink2:       #3d3830;
    --ink3:       #6b6459;
    --ink4:       #a09890;
    --green:      #00c853;
    --green-dim:  rgba(0,200,83,0.10);
    --green-mid:  rgba(0,200,83,0.22);
    --red:        #e53935;
    --red-dim:    rgba(229,57,53,0.10);
    --amber:      #f59e0b;
    --amber-dim:  rgba(245,158,11,0.10);
    --purple:     #7c3aed;
    --purple-dim: rgba(124,58,237,0.10);
    --border:     rgba(26,22,18,0.10);
    --border2:    rgba(26,22,18,0.18);
    --shadow:     0 2px 8px rgba(26,22,18,0.08);
    --shadow-md:  0 6px 24px rgba(26,22,18,0.12);
    --shadow-lg:  0 16px 48px rgba(26,22,18,0.20);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }

  body, .r-root {
    background: var(--cream);
    font-family: 'IBM Plex Sans', sans-serif;
    color: var(--ink);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ══════════════════════════════
     SHELL
  ══════════════════════════════ */
  .r-shell { display: flex; min-height: 100vh; }

  /* ══════════════════════════════
     DESKTOP SIDEBAR
  ══════════════════════════════ */
  .r-sidebar {
    width: 220px;
    flex-shrink: 0;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--ink2) var(--ink);
  }
  .r-logo-block {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .r-logo-mark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 0.05em;
    color: var(--green); line-height: 1; margin-bottom: 2px;
  }
  .r-logo-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px; color: rgba(255,255,255,0.3);
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .r-mode-block {
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .r-mode-lbl {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px; color: rgba(255,255,255,0.28);
    text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;
  }
  .r-mode-btn {
    display: block; width: 100%; text-align: left;
    padding: 8px 12px; margin-bottom: 4px;
    border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    color: rgba(255,255,255,0.45); background: transparent;
    cursor: pointer; transition: all 0.15s;
  }
  .r-mode-btn.active { background: var(--green-dim); border-color: var(--green); color: var(--green); }
  .r-mode-btn:not(.active):hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
  .r-cats-block { flex: 1; padding: 14px 20px; overflow-y: auto; }
  .r-cats-lbl {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px; color: rgba(255,255,255,0.28);
    text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;
  }
  .r-cat-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 8px 10px; margin-bottom: 2px;
    border: none; border-radius: 5px;
    font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; font-weight: 400;
    color: rgba(255,255,255,0.45); background: transparent;
    cursor: pointer; transition: all 0.12s; min-height: 38px;
  }
  .r-cat-btn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
  .r-cat-btn.active { background: var(--green); color: var(--ink); font-weight: 600; }
  .r-cat-btn:not(.active):hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
  .r-cat-n {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 3px; flex-shrink: 0;
  }
  .r-cat-btn.active .r-cat-n { background: rgba(26,22,18,0.18); }

  /* ══════════════════════════════
     MOBILE DRAWER
  ══════════════════════════════ */
  .r-overlay {
    position: fixed; inset: 0;
    background: rgba(26,22,18,0.55);
    z-index: 200; opacity: 0; pointer-events: none;
    transition: opacity 0.25s;
    backdrop-filter: blur(2px);
  }
  .r-overlay.open { opacity: 1; pointer-events: auto; }
  .r-drawer {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: 280px; max-width: 85vw;
    background: var(--ink);
    display: flex; flex-direction: column;
    z-index: 201;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
    box-shadow: var(--shadow-lg);
    overflow-y: auto;
  }
  .r-drawer.open { transform: translateX(0); }
  .r-drawer-top {
    padding: 16px 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
  }
  .r-drawer-close {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.15s;
  }
  .r-drawer-close:hover { background: rgba(255,255,255,0.12); color: white; }

  /* ══════════════════════════════
     MAIN AREA
  ══════════════════════════════ */
  .r-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

  /* topbar */
  .r-topbar {
    background: var(--cream);
    border-bottom: 2px solid var(--ink);
    padding: 0 20px;
    height: 54px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .r-topbar-l { display: flex; align-items: center; gap: 10px; }
  .r-burger {
    display: none;
    width: 38px; height: 38px;
    background: var(--ink); border: none; border-radius: 7px;
    align-items: center; justify-content: center;
    color: var(--cream); cursor: pointer; flex-shrink: 0;
  }
  .r-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px; letter-spacing: 0.04em; color: var(--ink); line-height: 1;
  }
  .r-title span { color: var(--green); }
  .r-topbar-r { display: flex; align-items: center; gap: 8px; }

  /* ticker */
  .r-ticker {
    background: var(--ink); padding: 7px 20px;
    display: flex; align-items: center; gap: 18px;
    overflow-x: auto; scrollbar-width: none;
  }
  .r-ticker::-webkit-scrollbar { display: none; }
  .r-tick-item { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .r-tick-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.08em; }
  .r-tick-val { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; color: var(--green); }
  .r-tick-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.1); flex-shrink: 0; }
  .r-tick-tag { font-family: 'IBM Plex Mono', monospace; font-size: 10px; padding: 1px 6px; border-radius: 3px; white-space: nowrap; }
  .tt-p { background: rgba(124,58,237,0.12); color: #b48aff; border: 1px solid rgba(124,58,237,0.25); }
  .tt-g { background: var(--green-dim); color: var(--green); border: 1px solid rgba(0,200,83,0.25); }
  .tt-r { background: var(--red-dim); color: #ff6b6b; border: 1px solid rgba(229,57,53,0.25); }

  /* mobile horizontal cat pills (hidden desktop) */
  .r-mob-cats {
    display: none;
    background: var(--ink); padding: 8px 12px;
    gap: 6px; overflow-x: auto; scrollbar-width: none;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .r-mob-cats::-webkit-scrollbar { display: none; }
  .r-mob-pill {
    flex-shrink: 0; display: flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 20px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent; color: rgba(255,255,255,0.45);
    cursor: pointer; transition: all 0.15s; white-space: nowrap; min-height: 34px;
  }
  .r-mob-pill.active { background: var(--green); border-color: var(--green); color: var(--ink); font-weight: 600; }
  .r-mob-pill .mn { font-size: 10px; background: rgba(255,255,255,0.1); padding: 0 5px; border-radius: 10px; }
  .r-mob-pill.active .mn { background: rgba(26,22,18,0.15); }

  /* body */
  .r-body { padding: 24px 24px 32px; flex: 1; }

  /* ══════════════════════════════
     SECTION HEAD
  ══════════════════════════════ */
  .r-sec-head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .r-sec-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 13px;
    color: var(--green); background: var(--green-dim);
    border: 1px solid var(--green-mid);
    width: 26px; height: 26px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .r-sec-title { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.06em; color: var(--ink); }
  .r-sec-line { flex: 1; height: 1px; background: var(--border2); }
  .r-sec-count { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--ink4); flex-shrink: 0; }

  /* ══════════════════════════════
     UPLOAD
  ══════════════════════════════ */
  .r-upload-section { margin-bottom: 20px; }
  .r-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .r-ucard {
    border: 1.5px dashed var(--border2); border-radius: 10px;
    padding: 16px; background: var(--cream2);
    transition: all 0.2s; cursor: pointer;
  }
  .r-ucard:hover, .r-ucard:focus-within { border-color: var(--ink3); background: var(--cream3); }
  .r-ucard.has-file { border-style: solid; border-color: var(--green); background: var(--green-dim); }
  .r-ucard-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .r-ucard-ic {
    width: 32px; height: 32px; border: 1.5px solid var(--border2); border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink3); background: var(--cream); flex-shrink: 0;
  }
  .r-ucard.has-file .r-ucard-ic { border-color: var(--green); color: var(--green); background: var(--green-dim); }
  .r-ucard-name { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 0.06em; color: var(--ink); }
  .r-ucard-sub { font-size: 10px; color: var(--ink3); font-family: 'IBM Plex Mono', monospace; }
  input[type="file"] { display: block; width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink3); cursor: pointer; }
  input[type="file"]::file-selector-button {
    background: var(--cream); border: 1px solid var(--border2); border-radius: 5px;
    padding: 5px 10px; font-family: 'IBM Plex Sans', sans-serif; font-size: 11px; font-weight: 500;
    color: var(--ink2); cursor: pointer; margin-right: 8px; transition: all 0.15s;
  }
  input[type="file"]::file-selector-button:hover { background: var(--ink); color: var(--cream); }
  .r-file-ok { margin-top: 6px; display: flex; align-items: center; gap: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--green); }
  .r-file-ok span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* ══════════════════════════════
     ACTIONS
  ══════════════════════════════ */
  .r-actions { display: flex; gap: 8px; margin-bottom: 28px; }
  .r-btn-run {
    flex: 1; background: var(--ink); color: var(--cream); border: none;
    border-radius: 8px; padding: 13px 20px;
    font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 0.08em;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.15s; min-height: 50px;
  }
  .r-btn-run:hover:not(:disabled) { background: var(--ink2); transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .r-btn-run:active:not(:disabled) { transform: translateY(0); }
  .r-btn-run:disabled { opacity: 0.38; cursor: not-allowed; }
  .r-btn-run .ba { color: var(--green); flex-shrink: 0; }
  .r-btn-export {
    background: var(--cream2); border: 1.5px solid var(--border2); color: var(--ink2);
    border-radius: 8px; padding: 13px 16px;
    font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; gap: 7px; transition: all 0.15s; white-space: nowrap;
  }
  .r-btn-export:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  @keyframes r-spin { to { transform: rotate(360deg); } }
  .r-spin {
    width: 18px; height: 18px;
    border: 2px solid rgba(245,240,232,0.3); border-top-color: var(--cream);
    border-radius: 50%; animation: r-spin 0.7s linear infinite; flex-shrink: 0;
  }

  /* ══════════════════════════════
     FILTER BAR
  ══════════════════════════════ */
  .r-filter-bar { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
  .r-filter-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--ink4); text-transform: uppercase; letter-spacing: 0.12em; }
  .r-chip {
    padding: 5px 11px; border-radius: 5px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
    cursor: pointer; border: 1px solid var(--border2); background: var(--cream2); color: var(--ink3);
    display: flex; align-items: center; gap: 5px; transition: all 0.12s; min-height: 32px;
  }
  .r-chip .cn { font-size: 10px; background: var(--cream3); padding: 0 5px; border-radius: 3px; color: var(--ink4); }
  .r-chip.f-all.act   { background: var(--ink);        border-color: var(--ink);    color: var(--cream);  }
  .r-chip.f-both.act  { background: var(--purple-dim); border-color: var(--purple); color: var(--purple); font-weight: 600; }
  .r-chip.f-price.act { background: var(--green-dim);  border-color: var(--green);  color: var(--green);  font-weight: 600; }
  .r-chip.f-stock.act { background: var(--red-dim);    border-color: var(--red);    color: var(--red);    font-weight: 600; }

  /* ══════════════════════════════
     AVAILABILITY GRID
  ══════════════════════════════ */
  .r-avail-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 18px; }
  .r-avail-card { border-radius: 8px; padding: 13px 12px; border: 1.5px solid var(--border); background: var(--cream2); }
  .r-avail-card.av-green { border-color: var(--green); background: var(--green-dim); }
  .r-avail-card.av-blue  { border-color: #60a5fa; background: rgba(96,165,250,0.07); }
  .r-avail-card.av-amber { border-color: var(--amber); background: var(--amber-dim); }
  .r-avail-card.av-slate { border-color: #94a3b8; background: rgba(148,163,184,0.07); }
  .r-avail-n { font-family: 'Bebas Neue', sans-serif; font-size: 32px; line-height: 1; margin-bottom: 3px; }
  .av-green .r-avail-n { color: var(--green); }
  .av-blue  .r-avail-n { color: #2563eb; }
  .av-amber .r-avail-n { color: var(--amber); }
  .av-slate .r-avail-n { color: #64748b; }
  .r-avail-title { font-size: 10px; font-weight: 600; color: var(--ink2); margin-bottom: 5px; line-height: 1.2; }
  .r-avail-badges { display: flex; gap: 4px; flex-wrap: wrap; }
  .r-avail-badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; padding: 2px 5px; border-radius: 3px; background: rgba(26,22,18,0.06); color: var(--ink3); border: 1px solid var(--border); }

  /* ══════════════════════════════
     STAT STRIP
  ══════════════════════════════ */
  .r-stat-strip {
    display: flex; border: 1.5px solid var(--border2); border-radius: 8px;
    overflow: hidden; margin-bottom: 18px; background: var(--cream2); overflow-x: auto;
  }
  .r-stat-cell { flex: 1; min-width: 80px; padding: 12px 14px; border-right: 1px solid var(--border); }
  .r-stat-cell:last-child { border-right: none; }
  .r-stat-lbl { font-family: 'IBM Plex Mono', monospace; font-size: 8px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink4); margin-bottom: 4px; white-space: nowrap; }
  .r-stat-v { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 0.02em; line-height: 1; color: var(--ink); }
  .sv-g { color: var(--green); }
  .sv-r { color: var(--red); }
  .sv-a { color: var(--amber); }

  /* ══════════════════════════════
     PRODUCT CARDS
  ══════════════════════════════ */
  .r-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 10px; }
  .r-pcard {
    background: var(--cream); border: 1.5px solid var(--border2); border-radius: 10px;
    overflow: hidden; transition: all 0.15s; box-shadow: var(--shadow);
  }
  .r-pcard:hover { border-color: var(--ink3); box-shadow: var(--shadow-md); transform: translateY(-1px); }
  .r-pcard:active { transform: translateY(0); }
  .r-pcard-head {
    padding: 11px 13px 9px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
  }
  .r-pcard-name { font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--ink); line-height: 1.35; flex: 1; }
  .r-pcard-ref { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--ink4); margin-top: 2px; }
  .r-pbadge {
    flex-shrink: 0; font-family: 'IBM Plex Mono', monospace;
    font-size: 9px; font-weight: 600; padding: 3px 7px; border-radius: 3px;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .pb-both  { background: var(--purple-dim); color: var(--purple); border: 1px solid rgba(124,58,237,0.2); }
  .pb-price { background: var(--green-dim);  color: var(--green);  border: 1px solid rgba(0,200,83,0.2); }
  .pb-stock { background: var(--red-dim);    color: var(--red);    border: 1px solid rgba(229,57,53,0.2); }
  .r-pcard-body { display: grid; grid-template-columns: 1fr 1fr; }
  .r-pcol { padding: 11px 13px; border-right: 1px solid var(--border); }
  .r-pcol:last-child { border-right: none; }
  .r-pcol-site { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--ink4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .r-pcol-price { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.02em; color: var(--ink); line-height: 1; margin-bottom: 5px; }
  .r-pstock { display: inline-flex; align-items: center; gap: 3px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; }
  .psi  { background: var(--green-dim); color: var(--green); }
  .pso  { background: var(--red-dim);   color: var(--red);   }
  .r-pcard-foot {
    padding: 8px 13px; background: var(--cream2); border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }
  .r-diff { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 0.02em; display: flex; align-items: center; gap: 3px; }
  .dv-up   { color: var(--red);   }
  .dv-down { color: var(--green); }
  .dv-eq   { color: var(--ink4);  }
  .r-diff-pct { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--ink4); }
  .r-links { display: flex; gap: 5px; flex-shrink: 0; }
  .r-link {
    font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 600;
    text-decoration: none; padding: 4px 8px; border-radius: 4px;
    background: var(--cream); border: 1px solid var(--border2); color: var(--ink3);
    transition: all 0.12s; display: flex; align-items: center; gap: 3px; min-height: 28px;
  }
  .r-link:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }

  /* ══════════════════════════════
     EMPTY
  ══════════════════════════════ */
  .r-empty { text-align: center; padding: 52px 20px; border: 1.5px dashed var(--border2); border-radius: 12px; background: var(--cream2); }
  .r-empty-ic { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: var(--border2); line-height: 1; margin-bottom: 12px; }
  .r-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.06em; color: var(--ink3); margin-bottom: 5px; }
  .r-empty-sub { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink4); }

  /* ══════════════════════════════
     BOTTOM NAV (mobile only)
  ══════════════════════════════ */
  .r-bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--ink); border-top: 1px solid rgba(255,255,255,0.08);
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .r-bottom-nav-inner { display: flex; }
  .r-btab {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 3px; padding: 10px 4px;
    background: transparent; border: none; cursor: pointer;
    color: rgba(255,255,255,0.32); transition: all 0.15s; min-height: 56px; position: relative;
  }
  .r-btab.active { color: var(--green); }
  .r-btab:disabled { opacity: 0.25; cursor: default; }
  .r-btab-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; }
  .r-btab-dot {
    position: absolute; top: 8px; right: calc(50% - 14px);
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
  }

  /* ══════════════════════════════
     RESPONSIVE BREAKPOINTS
  ══════════════════════════════ */

  /* ≤ 1024px — narrower sidebar */
  @media (max-width: 1024px) {
    .r-sidebar { width: 190px; }
  }

  /* ≤ 768px — mobile layout */
  @media (max-width: 768px) {
    /* Hide desktop sidebar, show mobile elements */
    .r-sidebar       { display: none; }
    .r-burger        { display: flex !important; }
    .r-mob-cats      { display: flex !important; }
    .r-bottom-nav    { display: block !important; }

    /* Body padding for bottom nav */
    .r-body          { padding: 16px 12px 80px; }

    /* Topbar */
    .r-topbar        { padding: 0 12px; height: 50px; }
    .r-title         { font-size: 20px; }
    .r-topbar-r      { gap: 6px; }

    /* Ticker */
    .r-ticker        { padding: 6px 12px; gap: 14px; }

    /* Upload full-width */
    .r-upload-grid   { grid-template-columns: 1fr; gap: 8px; }
    .r-ucard         { padding: 14px 12px; }

    /* Avail 2x2 */
    .r-avail-grid    { grid-template-columns: 1fr 1fr; gap: 7px; }
    .r-avail-n       { font-size: 28px; }
    .r-avail-card    { padding: 12px 10px; }

    /* Stat strip scrolls */
    .r-stat-strip    { overflow-x: auto; }
    .r-stat-cell     { min-width: 76px; padding: 10px 11px; }
    .r-stat-v        { font-size: 22px; }

    /* Cards single column */
    .r-cards-grid    { grid-template-columns: 1fr; }

    /* Section head simplified */
    .r-sec-line      { display: none; }
  }

  /* ≤ 480px — very small */
  @media (max-width: 480px) {
    .r-body          { padding: 12px 10px 80px; }
    .r-title         { font-size: 18px; }
    .r-avail-grid    { gap: 5px; }
    .r-avail-n       { font-size: 24px; }
    .r-pcol-price    { font-size: 16px; }
    .r-btn-run       { font-size: 15px; }
    .r-stat-v        { font-size: 20px; }
  }
`;

/* ── Helpers ── */
const normalizeRef = r => { if (!r) return 'nan'; return String(r).replace(/\.0$/, '').trim(); };
const priceToFloat = p => { if (!p) return null; const n = parseFloat(String(p).replace(/[^\d,]/g,'').replace(',','.')); return isNaN(n) ? null : n; };
const fmt = v => { if (v == null) return '—'; return v.toLocaleString('fr-MA',{minimumFractionDigits:2,maximumFractionDigits:2})+' MAD'; };

/* ══════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════ */
export default function PriceComparator() {
  const [mode,       setMode]       = useState('zt-up');
  const [ztFile,     setZtFile]     = useState(null);
  const [upFile,     setUpFile]     = useState(null);
  const [ztFile2,    setZtFile2]    = useState(null);
  const [nlFile,     setNlFile]     = useState(null);
  const [results,    setResults]    = useState(null);
  const [selCat,     setSelCat]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [filter,     setFilter]     = useState('all');
  const [drawer,     setDrawer]     = useState(false);
  const [mobTab,     setMobTab]     = useState('upload'); // 'upload' | 'results'

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer]);

  const onFile = (e, key) => {
    const f = e.target.files[0]; if (!f) return;
    ({zt:setZtFile, up:setUpFile, zt2:setZtFile2, nl:setNlFile}[key])(f);
  };
  const changeMode = m => { setMode(m); setResults(null); setSelCat(null); setDrawer(false); };
  const pickCat = cat => { setSelCat(cat); setDrawer(false); setMobTab('results'); };

  const compare = async () => {
    const isUp = mode === 'zt-up';
    const f1 = isUp ? ztFile : ztFile2, f2 = isUp ? upFile : nlFile;
    const s1 = 'ZoneTech', s2 = isUp ? 'UltraPC' : 'NextLevelPC';
    if (!f1 || !f2) { alert('Chargez les deux fichiers'); return; }
    setLoading(true);
    try {
      const parse = async f => XLSX.utils.sheet_to_json(XLSX.read(await f.arrayBuffer()).Sheets[XLSX.read(await f.arrayBuffer()).SheetNames[0]]);
      const [d1, d2] = await Promise.all([f1,f2].map(async f => {
        const wb = XLSX.read(await f.arrayBuffer());
        return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      }));
      const res = {};
      const cats = new Set([...d1.map(r=>r.categorie),...d2.map(r=>r.categorie)]);
      cats.forEach(cat => {
        if (!cat) return;
        const norm = rows => rows.filter(r=>r.categorie===cat).map(r=>({...r,reference:normalizeRef(r.reference),price_num:priceToFloat(r.price)})).filter(r=>r.reference!=='nan');
        const c1=norm(d1), c2=norm(d2);
        const m1=new Map(c1.map(i=>[i.reference,i])), m2=new Map(c2.map(i=>[i.reference,i]));
        const items=[];
        m1.forEach((i1,ref)=>{
          const i2=m2.get(ref); if(!i2) return;
          const sM=i1.availability!==i2.availability, pM=i1.price_num!==i2.price_num;
          if(!sM&&!pM) return;
          const diff=i1.price_num-i2.price_num, diffPct=i2.price_num?(diff/i2.price_num)*100:0;
          const dtype=(sM&&pM)?'both':pM?'price':'stock';
          items.push({
            product_name:i1.product_name||i1.nom_produit||'N/A', reference:ref,
            site1_price:i1.price_num, site2_price:i2.price_num,
            difference:diff, diff_percent:diffPct,
            site1_stock:i1.availability, site2_stock:i2.availability,
            difference_type:dtype,
            site1_url:i1.url_produit||i1.url||'', site2_url:i2.url_produit||i2.url||'',
            site1_name:s1, site2_name:s2
          });
        });
        if(items.length) res[cat]=items;
      });
      setResults(res);
      const keys=Object.keys(res);
      if(keys.length){ setSelCat(keys[0]); setMobTab('results'); }
      else alert('Aucune différence trouvée');
    } catch(e){ alert('Erreur : '+e.message); }
    finally { setLoading(false); }
  };

  const exportXlsx = () => {
    if(!results) return;
    const wb=XLSX.utils.book_new();
    Object.entries(results).forEach(([cat,data])=>{
      const ws=XLSX.utils.json_to_sheet(data.map(i=>({
        Product:i.product_name, Reference:i.reference,
        [`${i.site1_name} Price`]:fmt(i.site1_price), [`${i.site2_name} Price`]:fmt(i.site2_price),
        Diff:fmt(i.difference), 'Diff%':i.diff_percent.toFixed(2)+'%',
        [`${i.site1_name} Stock`]:i.site1_stock==='instock'?'✓':'✗',
        [`${i.site2_name} Stock`]:i.site2_stock==='instock'?'✓':'✗',
        Type:i.difference_type, [`${i.site1_name} URL`]:i.site1_url, [`${i.site2_name} URL`]:i.site2_url
      })));
      XLSX.utils.book_append_sheet(wb,ws,cat.substring(0,31));
    });
    XLSX.writeFile(wb,`COMPARAISON_${new Date().toISOString().substring(0,10)}.xlsx`);
  };

  const filtered = (() => {
    if(!results||!selCat) return [];
    const d=results[selCat];
    if(filter==='both')  return d.filter(x=>x.difference_type==='both');
    if(filter==='price') return d.filter(x=>x.difference_type==='price');
    if(filter==='stock') return d.filter(x=>x.difference_type==='stock');
    return d;
  })();

  const s1n = filtered[0]?.site1_name || 'ZoneTech';
  const s2n = filtered[0]?.site2_name || (mode==='zt-up'?'UltraPC':'NextLevelPC');

  const gStats = results ? (() => {
    let total=0, both=0, price=0, stock=0;
    Object.values(results).forEach(d=>{ total+=d.length; both+=d.filter(x=>x.difference_type==='both').length; price+=d.filter(x=>x.difference_type==='price').length; stock+=d.filter(x=>x.difference_type==='stock').length; });
    return { total, both, price, stock, cats:Object.keys(results).length };
  })() : null;

  const catD = results&&selCat ? results[selCat] : [];
  const ss = catD.length ? {
    s1ins2in:   filtered.filter(d=>d.site1_stock==='instock'   &&d.site2_stock==='instock').length,
    s1ins2out:  filtered.filter(d=>d.site1_stock==='instock'   &&d.site2_stock==='outofstock').length,
    s1outs2in:  filtered.filter(d=>d.site1_stock==='outofstock'&&d.site2_stock==='instock').length,
    s1outs2out: filtered.filter(d=>d.site1_stock==='outofstock'&&d.site2_stock==='outofstock').length,
  } : null;

  const canGo = mode==='zt-up' ? (ztFile&&upFile) : (ztFile2&&nlFile);
  const uploadFiles = mode==='zt-up'
    ? [{key:'zt',label:'ZoneTech',file:ztFile},{key:'up',label:'UltraPC',file:upFile}]
    : [{key:'zt2',label:'ZoneTech',file:ztFile2},{key:'nl',label:'NextLevelPC',file:nlFile}];

  /* shared sidebar/drawer content */
  const NavContent = ({ onClose }) => (
    <>
      <div className="r-mode-block">
        <div className="r-mode-lbl">Mode actif</div>
        <button className={`r-mode-btn ${mode==='zt-up'?'active':''}`} onClick={()=>changeMode('zt-up')}>ZoneTech · UltraPC</button>
        <button className={`r-mode-btn ${mode==='zt-nl'?'active':''}`} onClick={()=>changeMode('zt-nl')}>ZoneTech · NextLevel</button>
      </div>
      {results && (
        <div className="r-cats-block">
          <div className="r-cats-lbl">Catégories · {gStats?.cats}</div>
          {Object.keys(results).map(cat=>(
            <button key={cat} className={`r-cat-btn ${selCat===cat?'active':''}`} onClick={()=>pickCat(cat)}>
              <span>{cat}</span>
              <span className="r-cat-n">{results[cat].length}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="r-root">

        {/* Overlay + Drawer */}
        <div className={`r-overlay ${drawer?'open':''}`} onClick={()=>setDrawer(false)} />
        <div className={`r-drawer ${drawer?'open':''}`}>
          <div className="r-drawer-top">
            <div><div className="r-logo-mark">PRICEWATCH</div><div className="r-logo-sub">Market Intelligence</div></div>
            <button className="r-drawer-close" onClick={()=>setDrawer(false)}><X size={16}/></button>
          </div>
          <NavContent onClose={()=>setDrawer(false)} />
        </div>

        <div className="r-shell">

          {/* Desktop Sidebar */}
          <aside className="r-sidebar">
            <div className="r-logo-block">
              <div className="r-logo-mark">PRICEWATCH</div>
              <div className="r-logo-sub">Market Intelligence</div>
            </div>
            <NavContent />
          </aside>

          {/* Main */}
          <div className="r-main">

            {/* Topbar */}
            <div className="r-topbar">
              <div className="r-topbar-l">
                <button className="r-burger" style={{display:'none'}} onClick={()=>setDrawer(true)}><Menu size={17}/></button>
                <div className="r-title">INTEL <span>TARIFAIRE</span></div>
              </div>
              <div className="r-topbar-r">
                {results && (
                  <button className="r-btn-export" onClick={exportXlsx} style={{padding:'7px 14px',fontSize:12}}>
                    <Download size={13}/> Export
                  </button>
                )}
              </div>
            </div>

            {/* Ticker */}
            {gStats && (
              <div className="r-ticker">
                <div className="r-tick-item"><span className="r-tick-lbl">Produits</span><span className="r-tick-val">{gStats.total}</span></div>
                <div className="r-tick-sep"/>
                <div className="r-tick-item"><span className="r-tick-lbl">Catégories</span><span className="r-tick-val">{gStats.cats}</span></div>
                <div className="r-tick-sep"/>
                <div className="r-tick-item">
                  <span className="r-tick-tag tt-p">{gStats.both} P+S</span>
                  <span className="r-tick-tag tt-g">{gStats.price} PRIX</span>
                  <span className="r-tick-tag tt-r">{gStats.stock} STOCK</span>
                </div>
              </div>
            )}

            {/* Mobile horizontal cat pills */}
            {results && (
              <div className="r-mob-cats">
                {Object.keys(results).map(cat=>(
                  <button key={cat} className={`r-mob-pill ${selCat===cat?'active':''}`} onClick={()=>pickCat(cat)}>
                    {cat}<span className="mn">{results[cat].length}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Body */}
            <div className="r-body">

              {/* Upload — hidden on mobile when viewing results */}
              <div style={{display: mobTab==='results'&&results ? 'none' : 'block'}} className="r-upload-section">
                <div className="r-sec-head">
                  <div className="r-sec-num">01</div>
                  <div className="r-sec-title">Fichiers sources</div>
                  <div className="r-sec-line"/>
                </div>
                <div className="r-upload-grid">
                  {uploadFiles.map(({key,label,file})=>(
                    <div key={key} className={`r-ucard ${file?'has-file':''}`}>
                      <div className="r-ucard-top">
                        <div className="r-ucard-ic">{file?<CheckCircle size={15}/>:<Upload size={15}/>}</div>
                        <div><div className="r-ucard-name">{label}</div><div className="r-ucard-sub">.xlsx / .xls</div></div>
                      </div>
                      <input type="file" accept=".xlsx,.xls" onChange={e=>onFile(e,key)}/>
                      {file && <div className="r-file-ok"><CheckCircle size={10}/><span>{file.name}</span></div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions — hidden on mobile when viewing results */}
              <div className="r-actions" style={{display: mobTab==='results'&&results ? 'none' : 'flex'}}>
                <button className="r-btn-run" onClick={compare} disabled={!canGo||loading}>
                  {loading ? <><div className="r-spin"/><span>ANALYSE EN COURS</span></> : <><Zap size={15} className="ba"/><span>LANCER L'ANALYSE</span></>}
                </button>
              </div>

              {/* Results — hidden on mobile when on upload tab */}
              {results && selCat && (
                <div style={{display: mobTab==='upload' ? 'none' : 'block'}} id="r-results">

                  <div className="r-sec-head" style={{marginBottom:14}}>
                    <div className="r-sec-num">02</div>
                    <div className="r-sec-title" style={{fontSize:18}}>{selCat}</div>
                    <div className="r-sec-line"/>
                    <div className="r-sec-count">{results[selCat].length} produits</div>
                  </div>

                  {ss && (
                    <div className="r-avail-grid">
                      {[
                        {cls:'av-green',n:ss.s1ins2in,  title:'Disponibles partout',b1:`${s1n} ✓`,b2:`${s2n} ✓`},
                        {cls:'av-blue', n:ss.s1ins2out, title:`Excl. ${s1n}`,       b1:`${s1n} ✓`,b2:`${s2n} ✗`},
                        {cls:'av-amber',n:ss.s1outs2in, title:`Excl. ${s2n}`,       b1:`${s1n} ✗`,b2:`${s2n} ✓`},
                        {cls:'av-slate',n:ss.s1outs2out,title:'Rupture totale',     b1:`${s1n} ✗`,b2:`${s2n} ✗`},
                      ].map(({cls,n,title,b1,b2})=>(
                        <div key={cls} className={`r-avail-card ${cls}`}>
                          <div className="r-avail-n">{n}</div>
                          <div className="r-avail-title">{title}</div>
                          <div className="r-avail-badges"><span className="r-avail-badge">{b1}</span><span className="r-avail-badge">{b2}</span></div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="r-filter-bar">
                    <span className="r-filter-lbl">Filtrer ·</span>
                    {[
                      {key:'all',  cls:'f-all',  lbl:'Tous',    n:catD.length},
                      {key:'both', cls:'f-both', lbl:'P+S',     n:catD.filter(d=>d.difference_type==='both').length},
                      {key:'price',cls:'f-price',lbl:'Prix',    n:catD.filter(d=>d.difference_type==='price').length},
                      {key:'stock',cls:'f-stock',lbl:'Stock',   n:catD.filter(d=>d.difference_type==='stock').length},
                    ].map(f=>(
                      <button key={f.key} className={`r-chip ${f.cls} ${filter===f.key?'act':''}`} onClick={()=>setFilter(f.key)}>
                        {f.lbl}<span className="cn">{f.n}</span>
                      </button>
                    ))}
                  </div>

                  {filtered.length>0 && (
                    <div className="r-stat-strip">
                      {[
                        {lbl:'Produits',     v:filtered.length,                                                                                cls:''},
                        {lbl:`${s1n} +cher`, v:filtered.filter(d=>d.difference>0).length,                                                     cls:'sv-r'},
                        {lbl:`${s1n} −cher`, v:filtered.filter(d=>d.difference<0).length,                                                     cls:'sv-g'},
                        {lbl:'Écart moy.',   v:(filtered.reduce((s,d)=>s+Math.abs(d.diff_percent),0)/filtered.length).toFixed(1)+'%',          cls:'sv-a'},
                        {lbl:'Écart max',    v:Math.max(...filtered.map(d=>Math.abs(d.diff_percent))).toFixed(1)+'%',                          cls:'sv-r'},
                      ].map(({lbl,v,cls})=>(
                        <div key={lbl} className="r-stat-cell">
                          <div className="r-stat-lbl">{lbl}</div>
                          <div className={`r-stat-v ${cls}`}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filtered.length>0 ? (
                    <div className="r-cards-grid">
                      {filtered.map((item,i)=>(
                        <div key={i} className="r-pcard">
                          <div className="r-pcard-head">
                            <div>
                              <div className="r-pcard-name">{item.product_name}</div>
                              <div className="r-pcard-ref"># {item.reference}</div>
                            </div>
                            <span className={`r-pbadge ${item.difference_type==='both'?'pb-both':item.difference_type==='price'?'pb-price':'pb-stock'}`}>
                              {item.difference_type==='both'?'P+S':item.difference_type==='price'?'PRIX':'STOCK'}
                            </span>
                          </div>
                          <div className="r-pcard-body">
                            {[{name:item.site1_name,price:item.site1_price,stock:item.site1_stock},{name:item.site2_name,price:item.site2_price,stock:item.site2_stock}].map((s,j)=>(
                              <div key={j} className="r-pcol">
                                <div className="r-pcol-site">{s.name}</div>
                                <div className="r-pcol-price">{fmt(s.price)}</div>
                                <span className={`r-pstock ${s.stock==='instock'?'psi':'pso'}`}>{s.stock==='instock'?'● EN STOCK':'○ RUPTURE'}</span>
                              </div>
                            ))}
                          </div>
                          <div className="r-pcard-foot">
                            {item.difference!==0 ? (
                              <div>
                                <div className={`r-diff ${item.difference>0?'dv-up':'dv-down'}`}>
                                  {item.difference>0?<ArrowUp size={12}/>:<ArrowDown size={12}/>}
                                  {fmt(Math.abs(item.difference))}
                                </div>
                                <div className="r-diff-pct">{item.diff_percent>0?'+':''}{item.diff_percent.toFixed(1)}%</div>
                              </div>
                            ) : <div className="r-diff dv-eq">— IDENTIQUE</div>}
                            <div className="r-links">
                              {item.site1_url && <a href={item.site1_url} target="_blank" rel="noopener noreferrer" className="r-link">{item.site1_name.substring(0,2).toUpperCase()} ↗</a>}
                              {item.site2_url && <a href={item.site2_url} target="_blank" rel="noopener noreferrer" className="r-link">{item.site2_name.substring(0,2).toUpperCase()} ↗</a>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="r-empty"><div className="r-empty-ic">0</div><div className="r-empty-title">AUCUN RÉSULTAT</div><div className="r-empty-sub">Aucun produit ne correspond au filtre</div></div>
                  )}
                </div>
              )}

              {!results && !loading && (
                <div className="r-empty">
                  <div className="r-empty-ic">—</div>
                  <div className="r-empty-title">EN ATTENTE</div>
                  <div className="r-empty-sub">Chargez vos fichiers puis lancez l'analyse</div>
                </div>
              )}

            </div>{/* /body */}

            {/* ── Mobile Bottom Nav ── */}
            <nav className="r-bottom-nav">
              <div className="r-bottom-nav-inner">
                <button className={`r-btab ${mobTab==='upload'?'active':''}`} onClick={()=>setMobTab('upload')}>
                  <Upload size={18}/>
                  <span className="r-btab-label">Fichiers</span>
                </button>
                <button className={`r-btab ${mobTab==='results'?'active':''}`} onClick={()=>{ if(results){setMobTab('results');} }} disabled={!results}>
                  <BarChart2 size={18}/>
                  <span className="r-btab-label">Résultats</span>
                  {results && mobTab!=='results' && <span className="r-btab-dot"/>}
                </button>
                <button className="r-btab" onClick={exportXlsx} disabled={!results}>
                  <Download size={18}/>
                  <span className="r-btab-label">Export</span>
                </button>
                <button className="r-btab" onClick={()=>setDrawer(true)}>
                  <Menu size={18}/>
                  <span className="r-btab-label">Menu</span>
                </button>
              </div>
            </nav>

          </div>{/* /main */}
        </div>{/* /shell */}
      </div>
    </>
  );
}
