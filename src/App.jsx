import React, { useState } from 'react';
import { Upload, CheckCircle, Download, ArrowUp, ArrowDown, Zap, Package, DollarSign, AlertTriangle, Eye, BarChart2 } from 'lucide-react';
import * as XLSX from 'xlsx';

/* ═══════════════════════════════════════════════════════════════
   DESIGN DIRECTION : "Market Intelligence Terminal"
   — Éditorial / Bloomberg-inspired / Warm Cream + Electric Green
   — Données présentées en cartes produit scannables, pas en table
   — Layout en panneaux avec sidebar de navigation catégories
   — Typographie : Bebas Neue (titres choc) + IBM Plex Mono (data)
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
    --green-mid:  rgba(0,200,83,0.20);
    --red:        #e53935;
    --red-dim:    rgba(229,57,53,0.10);
    --red-mid:    rgba(229,57,53,0.20);
    --amber:      #f59e0b;
    --amber-dim:  rgba(245,158,11,0.10);
    --blue:       #2563eb;
    --blue-dim:   rgba(37,99,235,0.10);
    --purple:     #7c3aed;
    --purple-dim: rgba(124,58,237,0.10);
    --border:     rgba(26,22,18,0.10);
    --border2:    rgba(26,22,18,0.18);
    --shadow:     0 2px 8px rgba(26,22,18,0.08);
    --shadow-md:  0 4px 20px rgba(26,22,18,0.10);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, .r-root {
    background: var(--cream);
    font-family: 'IBM Plex Sans', sans-serif;
    color: var(--ink);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ─────────────────────────────────
     LAYOUT PRINCIPAL : sidebar + main
  ───────────────────────────────── */
  .r-shell {
    display: flex;
    min-height: 100vh;
  }

  /* ─────────────────────────────────
     SIDEBAR
  ───────────────────────────────── */
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

  .r-sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .r-logo-mark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.05em;
    color: var(--green);
    line-height: 1;
    margin-bottom: 2px;
  }
  .r-logo-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .r-sidebar-mode {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .r-sidebar-mode-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 8px;
  }
  .r-mode-btn {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    background: transparent;
    cursor: pointer;
    margin-bottom: 4px;
    transition: all 0.15s;
  }
  .r-mode-btn.active {
    background: var(--green-dim);
    border-color: var(--green);
    color: var(--green);
  }
  .r-mode-btn:not(.active):hover {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.8);
  }

  .r-sidebar-cats {
    flex: 1;
    padding: 16px 20px;
  }
  .r-sidebar-cats-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 10px;
  }
  .r-cat-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: left;
    padding: 7px 10px;
    border: none;
    border-radius: 5px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255,255,255,0.45);
    background: transparent;
    cursor: pointer;
    margin-bottom: 2px;
    transition: all 0.12s;
  }
  .r-cat-btn.active {
    background: var(--green);
    color: var(--ink);
    font-weight: 600;
  }
  .r-cat-btn:not(.active):hover {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.8);
  }
  .r-cat-count {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    background: rgba(255,255,255,0.08);
    padding: 1px 6px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .r-cat-btn.active .r-cat-count {
    background: rgba(26,22,18,0.15);
  }

  /* ─────────────────────────────────
     MAIN CONTENT
  ───────────────────────────────── */
  .r-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  /* ─── Topbar ─── */
  .r-topbar {
    background: var(--cream);
    border-bottom: 2px solid var(--ink);
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .r-topbar-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 0.04em;
    color: var(--ink);
    line-height: 1;
  }
  .r-topbar-title span {
    color: var(--green);
  }
  .r-topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ─── Ticker strip ─── */
  .r-ticker {
    background: var(--ink);
    padding: 7px 32px;
    display: flex;
    align-items: center;
    gap: 28px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .r-ticker::-webkit-scrollbar { display: none; }
  .r-ticker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .r-ticker-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .r-ticker-val {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    color: var(--green);
  }
  .r-ticker-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.1); }
  .r-ticker-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 3px;
  }
  .tt-p { background: var(--purple-dim); color: #b48aff; border: 1px solid rgba(124,58,237,0.25); }
  .tt-g { background: var(--green-dim);  color: var(--green); border: 1px solid rgba(0,200,83,0.25); }
  .tt-r { background: var(--red-dim);    color: #ff6b6b; border: 1px solid rgba(229,57,53,0.25); }

  /* ─── Body area ─── */
  .r-body {
    padding: 28px 32px;
    flex: 1;
  }

  /* ─────────────────────────────────
     UPLOAD ZONE
  ───────────────────────────────── */
  .r-upload-section {
    margin-bottom: 28px;
  }
  .r-section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .r-section-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    color: var(--green);
    background: var(--green-dim);
    border: 1px solid var(--green-mid);
    width: 24px; height: 24px;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .r-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 17px;
    letter-spacing: 0.06em;
    color: var(--ink);
  }
  .r-section-line {
    flex: 1;
    height: 1px;
    background: var(--border2);
  }

  .r-upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .r-upload-card {
    border: 1.5px dashed var(--border2);
    border-radius: 8px;
    padding: 20px;
    background: var(--cream2);
    transition: all 0.2s;
    cursor: pointer;
  }
  .r-upload-card:hover { border-color: var(--ink3); background: var(--cream3); }
  .r-upload-card.has-file {
    border-style: solid;
    border-color: var(--green);
    background: var(--green-dim);
  }
  .r-upload-row {
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
  }
  .r-upload-ic {
    width: 34px; height: 34px;
    border: 1.5px solid var(--border2);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink3);
    background: var(--cream);
    flex-shrink: 0;
  }
  .r-upload-card.has-file .r-upload-ic {
    border-color: var(--green);
    color: var(--green);
    background: var(--green-dim);
  }
  .r-upload-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 0.06em;
    color: var(--ink);
  }
  .r-upload-sub {
    font-size: 11px;
    color: var(--ink3);
    margin-top: 1px;
    font-family: 'IBM Plex Mono', monospace;
  }
  input[type="file"] {
    display: block; width: 100%;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; color: var(--ink3);
    cursor: pointer;
  }
  input[type="file"]::file-selector-button {
    background: var(--cream);
    border: 1px solid var(--border2);
    border-radius: 5px;
    padding: 5px 12px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 11px; font-weight: 500;
    color: var(--ink2);
    cursor: pointer;
    margin-right: 10px;
    transition: all 0.15s;
  }
  input[type="file"]::file-selector-button:hover {
    background: var(--ink); color: var(--cream);
  }
  .r-file-ok {
    margin-top: 8px;
    display: flex; align-items: center; gap: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; color: var(--green);
  }

  /* ─────────────────────────────────
     ACTIONS
  ───────────────────────────────── */
  .r-actions {
    display: flex; gap: 10px; margin-bottom: 32px;
  }
  .r-btn-run {
    flex: 1;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 7px;
    padding: 13px 24px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.08em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.15s;
  }
  .r-btn-run:hover:not(:disabled) {
    background: var(--ink2);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  .r-btn-run:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .r-btn-run .btn-accent { color: var(--green); }

  .r-btn-export {
    background: var(--cream2);
    border: 1.5px solid var(--border2);
    color: var(--ink2);
    border-radius: 7px;
    padding: 13px 20px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.15s;
  }
  .r-btn-export:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }

  @keyframes r-spin { to { transform: rotate(360deg); } }
  .r-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(245,240,232,0.3);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: r-spin 0.7s linear infinite;
  }

  /* ─────────────────────────────────
     FILTER BAR
  ───────────────────────────────── */
  .r-filter-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .r-filter-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--ink4);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-right: 4px;
  }
  .r-chip {
    padding: 5px 13px;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.12s;
    border: 1px solid var(--border2);
    background: var(--cream2);
    color: var(--ink3);
    display: flex; align-items: center; gap: 6px;
  }
  .r-chip .cn {
    font-size: 10px;
    background: var(--cream3);
    padding: 0 5px;
    border-radius: 3px;
    color: var(--ink4);
  }
  .r-chip.f-all.act   { background: var(--ink);    border-color: var(--ink);    color: var(--cream);  }
  .r-chip.f-both.act  { background: var(--purple-dim); border-color: var(--purple); color: var(--purple); font-weight: 600; }
  .r-chip.f-price.act { background: var(--green-dim);  border-color: var(--green);  color: var(--green);  font-weight: 600; }
  .r-chip.f-stock.act { background: var(--red-dim);    border-color: var(--red);    color: var(--red);    font-weight: 600; }
  .r-chip:not(.act):hover { border-color: var(--ink3); color: var(--ink); }

  /* ─────────────────────────────────
     STAT ROW (mini KPIs horizontal)
  ───────────────────────────────── */
  .r-stat-strip {
    display: flex;
    gap: 0;
    border: 1.5px solid var(--border2);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 24px;
    background: var(--cream2);
  }
  .r-stat-cell {
    flex: 1;
    padding: 14px 18px;
    border-right: 1px solid var(--border);
  }
  .r-stat-cell:last-child { border-right: none; }
  .r-stat-lbl {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink4);
    margin-bottom: 6px;
  }
  .r-stat-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px;
    letter-spacing: 0.02em;
    line-height: 1;
    color: var(--ink);
  }
  .r-stat-val.sv-green { color: var(--green); }
  .r-stat-val.sv-red   { color: var(--red);   }
  .r-stat-val.sv-amber { color: var(--amber); }

  /* ─────────────────────────────────
     CARDS GRID (le cœur du design)
  ───────────────────────────────── */
  .r-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
  }

  /* ─── Carte produit ─── */
  .r-pcard {
    background: var(--cream);
    border: 1.5px solid var(--border2);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.15s;
    box-shadow: var(--shadow);
  }
  .r-pcard:hover {
    border-color: var(--ink3);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  /* En-tête de carte */
  .r-pcard-head {
    padding: 12px 14px 10px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
  .r-pcard-name {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.3;
    flex: 1;
  }
  .r-pcard-ref {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--ink4);
    margin-top: 2px;
  }
  .r-pcard-badge {
    flex-shrink: 0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    padding: 3px 7px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .pb-both  { background: var(--purple-dim); color: var(--purple); border: 1px solid rgba(124,58,237,0.2); }
  .pb-price { background: var(--green-dim);  color: var(--green);  border: 1px solid rgba(0,200,83,0.2);  }
  .pb-stock { background: var(--red-dim);    color: var(--red);    border: 1px solid rgba(229,57,53,0.2);  }

  /* Corps de carte : 2 colonnes prix */
  .r-pcard-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  .r-price-col {
    padding: 12px 14px;
    border-right: 1px solid var(--border);
  }
  .r-price-col:last-child { border-right: none; }
  .r-price-site {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    color: var(--ink4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }
  .r-price-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.02em;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 5px;
  }
  .r-price-stock {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
  }
  .ps-in  { background: var(--green-dim); color: var(--green); }
  .ps-out { background: var(--red-dim);   color: var(--red);   }

  /* Footer de carte : écart */
  .r-pcard-foot {
    padding: 9px 14px;
    background: var(--cream2);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .r-diff-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .dv-up   { color: var(--red);   }
  .dv-down { color: var(--green); }
  .dv-eq   { color: var(--ink4);  }
  .r-diff-pct {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: var(--ink4);
  }
  .r-card-links {
    display: flex; gap: 5px;
  }
  .r-card-link {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    text-decoration: none;
    padding: 3px 8px;
    border-radius: 3px;
    background: var(--cream);
    border: 1px solid var(--border2);
    color: var(--ink3);
    transition: all 0.12s;
    display: flex; align-items: center; gap: 3px;
  }
  .r-card-link:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }

  /* ─────────────────────────────────
     AVAILABILITY SUMMARY (4 panneaux)
  ───────────────────────────────── */
  .r-avail-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 24px;
  }
  .r-avail-card {
    border-radius: 7px;
    padding: 14px 16px;
    border: 1.5px solid var(--border);
    background: var(--cream2);
  }
  .r-avail-card.av-green { border-color: var(--green); background: var(--green-dim); }
  .r-avail-card.av-blue  { border-color: #60a5fa;     background: rgba(96,165,250,0.07); }
  .r-avail-card.av-amber { border-color: var(--amber); background: var(--amber-dim); }
  .r-avail-card.av-slate { border-color: #94a3b8;     background: rgba(148,163,184,0.08); }
  .r-avail-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    line-height: 1;
    letter-spacing: 0.02em;
    margin-bottom: 4px;
  }
  .av-green .r-avail-num { color: var(--green); }
  .av-blue  .r-avail-num { color: #2563eb; }
  .av-amber .r-avail-num { color: var(--amber); }
  .av-slate .r-avail-num { color: #64748b; }
  .r-avail-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink2);
    margin-bottom: 6px;
  }
  .r-avail-badges { display: flex; gap: 4px; flex-wrap: wrap; }
  .r-avail-badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 3px;
    background: rgba(26,22,18,0.06);
    color: var(--ink3);
    border: 1px solid var(--border);
  }

  /* ─────────────────────────────────
     EMPTY / INITIAL STATES
  ───────────────────────────────── */
  .r-empty {
    text-align: center;
    padding: 64px 20px;
    border: 1.5px dashed var(--border2);
    border-radius: 10px;
    background: var(--cream2);
  }
  .r-empty-ic {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 64px;
    color: var(--border2);
    line-height: 1;
    margin-bottom: 12px;
    letter-spacing: 0.02em;
  }
  .r-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.06em;
    color: var(--ink3);
    margin-bottom: 5px;
  }
  .r-empty-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--ink4);
  }

  /* ─────────────────────────────────
     RESPONSIVE
  ───────────────────────────────── */
  @media (max-width: 900px) {
    .r-sidebar { display: none; }
    .r-body    { padding: 20px 16px; }
    .r-topbar  { padding: 0 16px; }
    .r-avail-grid   { grid-template-columns: 1fr 1fr; }
    .r-upload-grid  { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .r-avail-grid,
    .r-cards-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── Helpers ─── */
const normalizeRef = (ref) => {
  if (!ref) return 'nan';
  return String(ref).replace(/\.0$/, '').trim();
};
const priceToFloat = (p) => {
  if (!p) return null;
  const n = parseFloat(String(p).replace(/[^\d,]/g, '').replace(',', '.'));
  return isNaN(n) ? null : n;
};
const fmt = (val) => {
  if (val === null || val === undefined) return '—';
  return val.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD';
};

/* ─── Composant ─── */
const PriceComparator = () => {
  const [mode,    setMode]    = useState('zt-up');
  const [ztFile,  setZtFile]  = useState(null);
  const [upFile,  setUpFile]  = useState(null);
  const [ztFile2, setZtFile2] = useState(null);
  const [nlFile,  setNlFile]  = useState(null);
  const [results, setResults] = useState(null);
  const [selCat,  setSelCat]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter,  setFilter]  = useState('all');

  const onFile = (e, key) => {
    const f = e.target.files[0]; if (!f) return;
    if (key === 'zt')  setZtFile(f);
    if (key === 'up')  setUpFile(f);
    if (key === 'zt2') setZtFile2(f);
    if (key === 'nl')  setNlFile(f);
  };
  const onModeChange = (m) => { setMode(m); setResults(null); setSelCat(null); };

  const compare = async () => {
    let f1, f2, s1, s2;
    if (mode === 'zt-up') {
      if (!ztFile || !upFile) { alert('Chargez les deux fichiers'); return; }
      f1 = ztFile; f2 = upFile; s1 = 'ZoneTech'; s2 = 'UltraPC';
    } else {
      if (!ztFile2 || !nlFile) { alert('Chargez les deux fichiers'); return; }
      f1 = ztFile2; f2 = nlFile; s1 = 'ZoneTech'; s2 = 'NextLevelPC';
    }
    setLoading(true);
    try {
      const wb1 = XLSX.read(await f1.arrayBuffer());
      const wb2 = XLSX.read(await f2.arrayBuffer());
      const d1 = XLSX.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]);
      const d2 = XLSX.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]]);
      const res = {};
      const cats = new Set([...d1.map(r => r.categorie), ...d2.map(r => r.categorie)]);

      cats.forEach(cat => {
        if (!cat) return;
        const norm = (rows) => rows
          .filter(r => r.categorie === cat)
          .map(r => ({ ...r, reference: normalizeRef(r.reference), price_num: priceToFloat(r.price) }))
          .filter(r => r.reference !== 'nan');
        const c1 = norm(d1); const c2 = norm(d2);
        const m1 = new Map(c1.map(i => [i.reference, i]));
        const m2 = new Map(c2.map(i => [i.reference, i]));
        const items = [];
        m1.forEach((i1, ref) => {
          const i2 = m2.get(ref); if (!i2) return;
          const sM = i1.availability !== i2.availability;
          const pM = i1.price_num !== i2.price_num;
          if (!sM && !pM) return;
          const diff = i1.price_num - i2.price_num;
          const diffPct = i2.price_num ? (diff / i2.price_num) * 100 : 0;
          const dtype = (sM && pM) ? 'both' : pM ? 'price' : 'stock';
          const ctype = dtype === 'price' ? 'Différence de prix uniquement'
            : i1.availability === 'outofstock'
              ? `Out of stock ${s1} / In stock ${s2}`
              : `In stock ${s1} / Out of stock ${s2}`;
          items.push({
            product_name: i1.product_name || i1.nom_produit || 'N/A',
            reference: ref, site1_price: i1.price_num, site2_price: i2.price_num,
            difference: diff, diff_percent: diffPct,
            site1_stock: i1.availability, site2_stock: i2.availability,
            case: ctype, difference_type: dtype,
            site1_url: i1.url_produit || i1.url || '',
            site2_url: i2.url_produit || i2.url || '',
            site1_name: s1, site2_name: s2
          });
        });
        if (items.length) res[cat] = items;
      });
      setResults(res);
      const keys = Object.keys(res);
      if (keys.length) setSelCat(keys[0]); else alert('Aucune différence trouvée');
    } catch (err) { alert('Erreur : ' + err.message); }
    finally { setLoading(false); }
  };

  const exportXlsx = () => {
    if (!results) return;
    const wb = XLSX.utils.book_new();
    Object.entries(results).forEach(([cat, data]) => {
      const ws = XLSX.utils.json_to_sheet(data.map(item => ({
        'Product': item.product_name, 'Reference': item.reference,
        [`${item.site1_name} Price`]: fmt(item.site1_price),
        [`${item.site2_name} Price`]: fmt(item.site2_price),
        'Diff': fmt(item.difference), 'Diff %': item.diff_percent.toFixed(2) + '%',
        [`${item.site1_name} Stock`]: item.site1_stock === 'instock' ? '✓' : '✗',
        [`${item.site2_name} Stock`]: item.site2_stock === 'instock' ? '✓' : '✗',
        'Type': item.difference_type, 'Case': item.case,
        [`${item.site1_name} URL`]: item.site1_url,
        [`${item.site2_name} URL`]: item.site2_url,
      })));
      XLSX.utils.book_append_sheet(wb, ws, cat.substring(0, 31));
    });
    XLSX.writeFile(wb, `COMPARAISON_${new Date().toISOString().substring(0, 10)}.xlsx`);
  };

  const filtered = (() => {
    if (!results || !selCat) return [];
    const d = results[selCat];
    if (filter === 'both')  return d.filter(x => x.difference_type === 'both');
    if (filter === 'price') return d.filter(x => x.difference_type === 'price');
    if (filter === 'stock') return d.filter(x => x.difference_type === 'stock');
    return d;
  })();

  const s1n = filtered[0]?.site1_name || (mode === 'zt-up' ? 'ZoneTech' : 'ZoneTech');
  const s2n = filtered[0]?.site2_name || (mode === 'zt-up' ? 'UltraPC'  : 'NextLevelPC');

  const gStats = results ? (() => {
    let total = 0, both = 0, price = 0, stock = 0;
    Object.values(results).forEach(d => {
      total += d.length;
      both  += d.filter(x => x.difference_type === 'both').length;
      price += d.filter(x => x.difference_type === 'price').length;
      stock += d.filter(x => x.difference_type === 'stock').length;
    });
    return { total, both, price, stock, cats: Object.keys(results).length };
  })() : null;

  const catD = results && selCat ? results[selCat] : [];
  const ss = catD.length ? {
    s1ins2in:   filtered.filter(d => d.site1_stock==='instock'    && d.site2_stock==='instock').length,
    s1ins2out:  filtered.filter(d => d.site1_stock==='instock'    && d.site2_stock==='outofstock').length,
    s1outs2in:  filtered.filter(d => d.site1_stock==='outofstock' && d.site2_stock==='instock').length,
    s1outs2out: filtered.filter(d => d.site1_stock==='outofstock' && d.site2_stock==='outofstock').length,
  } : null;

  const canGo = mode === 'zt-up' ? (ztFile && upFile) : (ztFile2 && nlFile);
  const uploadFiles = mode === 'zt-up'
    ? [{ key: 'zt', label: 'ZoneTech', file: ztFile }, { key: 'up', label: 'UltraPC', file: upFile }]
    : [{ key: 'zt2', label: 'ZoneTech', file: ztFile2 }, { key: 'nl', label: 'NextLevelPC', file: nlFile }];

  return (
    <>
      <style>{css}</style>
      <div className="r-root">
        <div className="r-shell">

          {/* ══ SIDEBAR ══ */}
          <aside className="r-sidebar">
            <div className="r-sidebar-logo">
              <div className="r-logo-mark">PRICE MATCHING</div>
              <div className="r-logo-sub">Market Intelligence</div>
            </div>

            <div className="r-sidebar-mode">
              <div className="r-sidebar-mode-label">Comparaison active</div>
              <button className={`r-mode-btn ${mode === 'zt-up' ? 'active' : ''}`} onClick={() => onModeChange('zt-up')}>
                ZoneTech · UltraPC
              </button>
              <button className={`r-mode-btn ${mode === 'zt-nl' ? 'active' : ''}`} onClick={() => onModeChange('zt-nl')}>
                ZoneTech · NextLevel
              </button>
            </div>

            {results && (
              <div className="r-sidebar-cats">
                <div className="r-sidebar-cats-label">Catégories · {gStats?.cats}</div>
                {Object.keys(results).map(cat => (
                  <button key={cat} className={`r-cat-btn ${selCat === cat ? 'active' : ''}`} onClick={() => setSelCat(cat)}>
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cat}</span>
                    <span className="r-cat-count">{results[cat].length}</span>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* ══ MAIN ══ */}
          <div className="r-main">

            {/* Topbar */}
            <div className="r-topbar">
              <div className="r-topbar-title">
                ACH TARI <span>F STOCK</span>
              </div>
              <div className="r-topbar-right">
                {results && (
                  <button className="r-btn-export" onClick={exportXlsx}>
                    <Download size={14} /> Exporter Excel
                  </button>
                )}
              </div>
            </div>

            {/* Ticker avec stats globales */}
            {gStats && (
              <div className="r-ticker">
                <div className="r-ticker-item">
                  <span className="r-ticker-label">Total produits</span>
                  <span className="r-ticker-val">{gStats.total}</span>
                </div>
                <div className="r-ticker-sep" />
                <div className="r-ticker-item">
                  <span className="r-ticker-label">Catégories</span>
                  <span className="r-ticker-val">{gStats.cats}</span>
                </div>
                <div className="r-ticker-sep" />
                <div className="r-ticker-item">
                  <span className="r-ticker-label">Répartition</span>
                  <span className="r-ticker-tag tt-p">{gStats.both} PRIX+STOCK</span>
                  <span className="r-ticker-tag tt-g">{gStats.price} PRIX</span>
                  <span className="r-ticker-tag tt-r">{gStats.stock} STOCK</span>
                </div>
              </div>
            )}

            <div className="r-body">

              {/* ── Section upload ── */}
              <div className="r-upload-section">
                <div className="r-section-head">
                  <div className="r-section-num">01</div>
                  <div className="r-section-title">Fichiers sources</div>
                  <div className="r-section-line" />
                </div>
                <div className="r-upload-grid">
                  {uploadFiles.map(({ key, label, file }) => (
                    <div key={key} className={`r-upload-card ${file ? 'has-file' : ''}`}>
                      <div className="r-upload-row">
                        <div className="r-upload-ic">
                          {file ? <CheckCircle size={16} /> : <Upload size={16} />}
                        </div>
                        <div>
                          <div className="r-upload-title">{label}</div>
                          <div className="r-upload-sub">.xlsx / .xls</div>
                        </div>
                      </div>
                      <input type="file" accept=".xlsx,.xls" onChange={e => onFile(e, key)} />
                      {file && <div className="r-file-ok"><CheckCircle size={11} /> {file.name}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="r-actions">
                <button className="r-btn-run" onClick={compare} disabled={!canGo || loading}>
                  {loading
                    ? <><div className="r-spinner" /> ANALYSE EN COURS</>
                    : <><Zap size={16} className="btn-accent" /> <span>LANCER L'ANALYSE</span></>}
                </button>
              </div>

              {/* ── Résultats ── */}
              {results && selCat && (
                <>
                  {/* Titre catégorie sélectionnée */}
                  <div className="r-section-head" style={{ marginBottom: 16 }}>
                    <div className="r-section-num">02</div>
                    <div className="r-section-title" style={{ fontSize: 20 }}>{selCat}</div>
                    <div className="r-section-line" />
                    <div style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:11, color:'var(--ink4)', flexShrink:0 }}>
                      {results[selCat].length} produits
                    </div>
                  </div>

                  {/* Disponibilité */}
                  {ss && (
                    <div className="r-avail-grid">
                      {[
                        { cls:'av-green', num: ss.s1ins2in,   title:'Disponibles partout', b1:`${s1n} ✓`, b2:`${s2n} ✓` },
                        { cls:'av-blue',  num: ss.s1ins2out,  title:`Exclusif ${s1n}`,     b1:`${s1n} ✓`, b2:`${s2n} ✗` },
                        { cls:'av-amber', num: ss.s1outs2in,  title:`Exclusif ${s2n}`,     b1:`${s1n} ✗`, b2:`${s2n} ✓` },
                        { cls:'av-slate', num: ss.s1outs2out, title:'Rupture totale',      b1:`${s1n} ✗`, b2:`${s2n} ✗` },
                      ].map(({ cls, num, title, b1, b2 }) => (
                        <div key={cls} className={`r-avail-card ${cls}`}>
                          <div className="r-avail-num">{num}</div>
                          <div className="r-avail-title">{title}</div>
                          <div className="r-avail-badges">
                            <span className="r-avail-badge">{b1}</span>
                            <span className="r-avail-badge">{b2}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Filtre + stat strip */}
                  <div className="r-filter-bar">
                    <span className="r-filter-label">Filtrer ·</span>
                    {[
                      { key:'all',   cls:'f-all',   label:'Tous',         count: catD.length },
                      { key:'both',  cls:'f-both',  label:'Prix + Stock', count: catD.filter(d=>d.difference_type==='both').length  },
                      { key:'price', cls:'f-price', label:'Prix seul',    count: catD.filter(d=>d.difference_type==='price').length },
                      { key:'stock', cls:'f-stock', label:'Stock seul',   count: catD.filter(d=>d.difference_type==='stock').length },
                    ].map(f => (
                      <button key={f.key} className={`r-chip ${f.cls} ${filter===f.key?'act':''}`} onClick={()=>setFilter(f.key)}>
                        {f.label}<span className="cn">{f.count}</span>
                      </button>
                    ))}
                  </div>

                  {/* Stat strip */}
                  {filtered.length > 0 && (
                    <div className="r-stat-strip">
                      <div className="r-stat-cell">
                        <div className="r-stat-lbl">Produits affichés</div>
                        <div className="r-stat-val">{filtered.length}</div>
                      </div>
                      <div className="r-stat-cell">
                        <div className="r-stat-lbl">{s1n} + cher</div>
                        <div className="r-stat-val sv-red">{filtered.filter(d=>d.difference>0).length}</div>
                      </div>
                      <div className="r-stat-cell">
                        <div className="r-stat-lbl">{s1n} – cher</div>
                        <div className="r-stat-val sv-green">{filtered.filter(d=>d.difference<0).length}</div>
                      </div>
                      <div className="r-stat-cell">
                        <div className="r-stat-lbl">Écart moyen</div>
                        <div className="r-stat-val sv-amber">
                          {(filtered.reduce((s,d)=>s+Math.abs(d.diff_percent),0)/filtered.length).toFixed(1)}%
                        </div>
                      </div>
                      <div className="r-stat-cell">
                        <div className="r-stat-lbl">Écart max</div>
                        <div className="r-stat-val sv-red">
                          {Math.max(...filtered.map(d=>Math.abs(d.diff_percent))).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grille de cartes produit */}
                  {filtered.length > 0 ? (
                    <div className="r-cards-grid">
                      {filtered.map((item, i) => (
                        <div key={i} className="r-pcard">

                          {/* En-tête */}
                          <div className="r-pcard-head">
                            <div>
                              <div className="r-pcard-name">{item.product_name}</div>
                              <div className="r-pcard-ref"># {item.reference}</div>
                            </div>
                            <span className={`r-pcard-badge ${item.difference_type==='both'?'pb-both':item.difference_type==='price'?'pb-price':'pb-stock'}`}>
                              {item.difference_type==='both'?'P+S':item.difference_type==='price'?'PRIX':'STOCK'}
                            </span>
                          </div>

                          {/* Corps : prix côte à côte */}
                          <div className="r-pcard-body">
                            <div className="r-price-col">
                              <div className="r-price-site">{item.site1_name}</div>
                              <div className="r-price-val">{fmt(item.site1_price)}</div>
                              <span className={`r-price-stock ${item.site1_stock==='instock'?'ps-in':'ps-out'}`}>
                                {item.site1_stock==='instock' ? '● EN STOCK' : '○ RUPTURE'}
                              </span>
                            </div>
                            <div className="r-price-col">
                              <div className="r-price-site">{item.site2_name}</div>
                              <div className="r-price-val">{fmt(item.site2_price)}</div>
                              <span className={`r-price-stock ${item.site2_stock==='instock'?'ps-in':'ps-out'}`}>
                                {item.site2_stock==='instock' ? '● EN STOCK' : '○ RUPTURE'}
                              </span>
                            </div>
                          </div>

                          {/* Pied : écart + liens */}
                          <div className="r-pcard-foot">
                            {item.difference !== 0 ? (
                              <div>
                                <div className={`r-diff-val ${item.difference>0?'dv-up':'dv-down'}`}>
                                  {item.difference>0
                                    ? <ArrowUp size={13} />
                                    : <ArrowDown size={13} />}
                                  {fmt(Math.abs(item.difference))}
                                </div>
                                <div className="r-diff-pct">
                                  {item.diff_percent>0?'+':''}{item.diff_percent.toFixed(1)}% · {item.site1_name} ref
                                </div>
                              </div>
                            ) : (
                              <div className="r-diff-val dv-eq">— IDENTIQUE</div>
                            )}
                            <div className="r-card-links">
                              {item.site1_url && (
                                <a href={item.site1_url} target="_blank" rel="noopener noreferrer" className="r-card-link">
                                  {item.site1_name.substring(0,2).toUpperCase()} ↗
                                </a>
                              )}
                              {item.site2_url && (
                                <a href={item.site2_url} target="_blank" rel="noopener noreferrer" className="r-card-link">
                                  {item.site2_name.substring(0,2).toUpperCase()} ↗
                                </a>
                              )}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="r-empty">
                      <div className="r-empty-ic">0</div>
                      <div className="r-empty-title">AUCUN RÉSULTAT</div>
                      <div className="r-empty-sub">Aucun produit ne correspond au filtre sélectionné</div>
                    </div>
                  )}
                </>
              )}

              {/* État initial */}
              {!results && !loading && (
                <div className="r-empty">
                  <div className="r-empty-ic">—</div>
                  <div className="r-empty-title">EN ATTENTE D'ANALYSE</div>
                  <div className="r-empty-sub">
                    Chargez vos fichiers {mode==='zt-up'?'ZoneTech & UltraPC':'ZoneTech & NextLevelPC'} puis lancez l'analyse
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceComparator;
