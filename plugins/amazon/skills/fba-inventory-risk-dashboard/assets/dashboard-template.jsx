// FBA Inventory Risk Dashboard — Template
//
// To populate: replace the RAW array, BRAND, MARKETPLACE, SNAPSHOT, and WINDOW
// values with the actual data from the analyst response.
//
// RAW row schema: { sku: string, asin: string, fulfillable: number, daily: number, dos: number }
//   - fulfillable: integer count from afn-fulfillable-quantity
//   - daily: avg daily units sold over the trailing 30 days (use raw float from analyst data field)
//   - dos: days of supply (fulfillable / daily)
//
// Do not modify the styling — the editorial-financial aesthetic is part of the skill.

import { useState, useMemo, useEffect } from "react";
import { ArrowUp, ArrowDown, ChevronsUpDown, Search } from "lucide-react";

// ── REPLACE THESE ─────────────────────────────────────────────────────────────
const BRAND = "{{ BRAND_NAME }}";              // e.g., "Velvet Bloom Cosmetics"
const MARKETPLACE = "{{ MARKETPLACE }}";        // e.g., "US Marketplace"
const SNAPSHOT = "{{ SNAPSHOT_UTC }}";          // e.g., "2026-05-07 · 14:48 UTC"
const WINDOW = "{{ DATE_WINDOW }}";             // e.g., "30D · 04-07 → 05-07"

const RAW = [
  // { sku: "BL-ROSE-GLWY", asin: "B0BEA1UTY0", fulfillable: 3, daily: 5.4333, dos: 0.55 },
  // ... populate from analyst data field
];
// ──────────────────────────────────────────────────────────────────────────────

const palette = {
  bg: "#f4eee0",
  paper: "#fbf7ec",
  ink: "#1a1612",
  mute: "#7a6f5e",
  rule: "#d4cab3",
  oxblood: "#8a1c1c",
  amber: "#a86a16",
  olive: "#7a7320",
  forest: "#2c3a2c",
};

function tier(dos) {
  if (dos < 2) return { label: "CRITICAL", color: palette.oxblood };
  if (dos < 7) return { label: "HIGH", color: palette.amber };
  return { label: "ELEVATED", color: palette.olive };
}

function Stat({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-5" style={{ borderRight: `1px solid ${palette.rule}` }}>
      <div
        className="text-xs uppercase tracking-widest"
        style={{ color: palette.mute, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.18em" }}
      >
        {label}
      </div>
      <div
        className="text-4xl"
        style={{ fontFamily: "'Instrument Serif', serif", color: palette.ink, lineHeight: 1 }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: palette.mute, fontFamily: "'Geist', sans-serif" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function SortHeader({ label, active, dir, onClick, align = "left" }) {
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 select-none"
      style={{
        color: active ? palette.ink : palette.mute,
        fontFamily: "'Geist Mono', monospace",
        fontSize: "10.5px",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        marginLeft: align === "right" ? "auto" : 0,
      }}
    >
      <span>{label}</span>
      <Icon size={12} strokeWidth={2} />
    </button>
  );
}

export default function InventoryRiskDashboard() {
  const [sort, setSort] = useState({ key: "dos", dir: "asc" });
  const [query, setQuery] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    return () => {
      try { document.head.removeChild(link); } catch (e) {}
    };
  }, []);

  const totalDailyAtRisk = useMemo(() => RAW.reduce((s, r) => s + r.daily, 0), []);
  const criticalCount = useMemo(() => RAW.filter((r) => r.dos < 2).length, []);
  const highCount = useMemo(() => RAW.filter((r) => r.dos >= 2 && r.dos < 7).length, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? RAW.filter((r) => r.sku.toLowerCase().includes(q) || r.asin.toLowerCase().includes(q))
      : RAW;
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === "string") {
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sort.dir === "asc" ? av - bv : bv - av;
    });
    return sorted;
  }, [sort, query]);

  const setSortKey = (key) => {
    setSort((cur) =>
      cur.key === key
        ? { key, dir: cur.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "sku" || key === "asin" ? "asc" : "desc" }
    );
  };

  const maxDaily = RAW.length ? Math.max(...RAW.map((r) => r.daily)) : 1;

  return (
    <div className="min-h-screen w-full" style={{ background: palette.bg, fontFamily: "'Geist', sans-serif", color: palette.ink }}>
      <div className="max-w-6xl mx-auto px-6 py-10 md:px-12 md:py-14">
        <header
          className="pb-8 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          style={{ borderBottom: `2px solid ${palette.ink}` }}
        >
          <div>
            <div
              className="text-xs uppercase mb-3"
              style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: "0.24em", color: palette.oxblood }}
            >
              ⏱ Live · {BRAND} · {MARKETPLACE}
            </div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                lineHeight: 0.95,
                color: palette.ink,
                fontWeight: 400,
              }}
            >
              FBA Inventory <em style={{ color: palette.oxblood }}>at risk</em>
            </h1>
            <p className="mt-3 max-w-xl" style={{ color: palette.mute, fontSize: "14px", lineHeight: 1.55 }}>
              SKUs with stock on hand but fewer than 14 days of supply at trailing 30-day run rate.
              Sorted by urgency — most pressing first.
            </p>
          </div>
          <div
            className="text-xs"
            style={{ fontFamily: "'Geist Mono', monospace", color: palette.mute, letterSpacing: "0.08em", textAlign: "right" }}
          >
            <div>SNAPSHOT</div>
            <div style={{ color: palette.ink }}>{SNAPSHOT}</div>
            <div className="mt-2">WINDOW</div>
            <div style={{ color: palette.ink }}>{WINDOW}</div>
          </div>
        </header>

        <section
          className="grid grid-cols-2 md:grid-cols-4 mb-10"
          style={{ background: palette.paper, border: `1px solid ${palette.rule}` }}
        >
          <Stat label="At-risk SKUs" value={RAW.length} sub="Stock > 0 · DOS < 14d" />
          <Stat label="Critical · <2 days" value={criticalCount} sub="Stockout imminent within 48h" />
          <Stat label="High · 2–7 days" value={highCount} sub="Reorder window closing" />
          <Stat label="Daily units at risk" value={Math.round(totalDailyAtRisk)} sub={`Combined run rate, ${RAW.length} SKUs`} />
        </section>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center gap-2 px-3 py-2 flex-1 max-w-md"
            style={{ background: palette.paper, border: `1px solid ${palette.rule}` }}
          >
            <Search size={14} style={{ color: palette.mute }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by SKU or ASIN…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: palette.ink, fontFamily: "'Geist Mono', monospace" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs"
                style={{ color: palette.mute, fontFamily: "'Geist Mono', monospace" }}
              >
                clear
              </button>
            )}
          </div>
          <div className="text-xs" style={{ color: palette.mute, fontFamily: "'Geist Mono', monospace" }}>
            {rows.length} of {RAW.length}
          </div>
        </div>

        <div className="overflow-x-auto" style={{ background: palette.paper, border: `1px solid ${palette.rule}` }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${palette.ink}` }}>
                <th className="px-4 py-3 text-left" style={{ width: "60px" }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10.5px", letterSpacing: "0.16em", color: palette.mute }}>
                    TIER
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <SortHeader label="Seller SKU" active={sort.key === "sku"} dir={sort.dir} onClick={() => setSortKey("sku")} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortHeader label="ASIN" active={sort.key === "asin"} dir={sort.dir} onClick={() => setSortKey("asin")} />
                </th>
                <th className="px-4 py-3 text-right">
                  <SortHeader label="Fulfillable" active={sort.key === "fulfillable"} dir={sort.dir} onClick={() => setSortKey("fulfillable")} align="right" />
                </th>
                <th className="px-4 py-3 text-right">
                  <SortHeader label="Avg/day · 30d" active={sort.key === "daily"} dir={sort.dir} onClick={() => setSortKey("daily")} align="right" />
                </th>
                <th className="px-4 py-3 text-right">
                  <SortHeader label="Days of supply" active={sort.key === "dos"} dir={sort.dir} onClick={() => setSortKey("dos")} align="right" />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const t = tier(r.dos);
                const intensity = r.daily / maxDaily;
                return (
                  <tr
                    key={r.sku}
                    style={{
                      borderBottom: i === rows.length - 1 ? "none" : `1px dashed ${palette.rule}`,
                      background: r.dos < 2 ? "rgba(138, 28, 28, 0.04)" : "transparent",
                    }}
                  >
                    <td className="px-4 py-3" style={{ verticalAlign: "middle" }}>
                      <div className="flex items-center gap-2">
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: t.color }} />
                        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "9.5px", letterSpacing: "0.12em", color: t.color, fontWeight: 500 }}>
                          {t.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", color: palette.ink, fontWeight: 500 }}>
                      {r.sku}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "12px", color: palette.mute }}>
                      {r.asin}
                    </td>
                    <td className="px-4 py-3 text-right" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", color: palette.ink }}>
                      {r.fulfillable}
                    </td>
                    <td className="px-4 py-3 text-right" style={{ verticalAlign: "middle" }}>
                      <div className="flex items-center justify-end gap-2.5">
                        <div style={{ width: 60, height: 4, background: palette.rule, position: "relative" }}>
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${intensity * 100}%`, background: palette.forest }} />
                        </div>
                        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", color: palette.ink, minWidth: 48, textAlign: "right" }}>
                          {r.daily.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right" style={{ fontFamily: "'Instrument Serif', serif", fontSize: "20px", color: t.color, fontWeight: 400 }}>
                      {r.dos.toFixed(2)}
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: palette.mute, marginLeft: 4, letterSpacing: "0.08em" }}>
                        d
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer
          className="mt-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs"
          style={{ borderTop: `1px solid ${palette.rule}`, color: palette.mute, fontFamily: "'Geist', sans-serif", lineHeight: 1.6 }}
        >
          <div>
            <div className="uppercase mb-1.5" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", letterSpacing: "0.16em", color: palette.ink }}>
              Methodology
            </div>
            DOS = fulfillable ÷ avg daily units (30d). Sales window:&nbsp;
            <span style={{ color: palette.ink, fontFamily: "'Geist Mono', monospace" }}>{WINDOW}</span>.
          </div>
          <div>
            <div className="uppercase mb-1.5" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", letterSpacing: "0.16em", color: palette.ink }}>
              Excluded
            </div>
            Inbound shipments, reserved units, and MFN inventory are not counted. SKUs with zero stock or zero 30-day sales are filtered out.
          </div>
          <div>
            <div className="uppercase mb-1.5" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", letterSpacing: "0.16em", color: palette.ink }}>
              Source
            </div>
            sp_fba_inventory · sp_orders · 30-day trailing window. Snapshot from {SNAPSHOT}.
          </div>
        </footer>
      </div>
    </div>
  );
}
