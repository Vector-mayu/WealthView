// ─── CATEGORY CONFIG ──────────────────────────────────────────────────────────
export const CATEGORY_CONFIG = {
  Rent:       { color: "wv-green",  tailwind: "text-wv-green  bg-wv-green/10",  hex: "#10b981" },
  Groceries:  { color: "wv-blue",   tailwind: "text-wv-blue   bg-wv-blue/10",   hex: "#3b82f6" },
  Food:       { color: "wv-amber",  tailwind: "text-wv-amber  bg-wv-amber/10",  hex: "#f59e0b" },
  Utilities:  { color: "wv-purple", tailwind: "text-wv-purple bg-wv-purple/10", hex: "#8b5cf6" },
  Transport:  { color: "wv-cyan",   tailwind: "text-wv-cyan   bg-wv-cyan/10",   hex: "#06b6d4" },
  Salary:     { color: "wv-green",  tailwind: "text-wv-green  bg-wv-green/10",  hex: "#10b981" },
  Freelance:  { color: "wv-green",  tailwind: "text-emerald-400 bg-emerald-400/10", hex: "#34d399" },
  Shopping:   { color: "wv-pink",   tailwind: "text-wv-pink   bg-wv-pink/10",   hex: "#ec4899" },
  Healthcare: { color: "wv-red",    tailwind: "text-wv-red    bg-wv-red/10",    hex: "#f43f5e" },
  Internet:   { color: "wv-cyan",   tailwind: "text-wv-cyan   bg-wv-cyan/10",   hex: "#06b6d4" },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG);

export const getCatCfg = (cat) =>
  CATEGORY_CONFIG[cat] || { tailwind: "text-gray-500 bg-gray-500/10", hex: "#64748b" };

// ─── FORMATTERS ───────────────────────────────────────────────────────────────
export const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const fmtDateShort = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

// ─── FINANCIAL THOUGHTS ───────────────────────────────────────────────────────
export const FINANCIAL_THOUGHTS = [
  { text: "Do not save what is left after spending; spend what is left after saving.", author: "Warren Buffett" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "It's not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
];

// ─── CHART DATA (static for dashboard overview) ───────────────────────────────
export const MONTHLY_CHART = [
  { month: "Oct", income: 14000, expense: 5200 },
  { month: "Nov", income: 14500, expense: 4800 },
  { month: "Dec", income: 15000, expense: 6200 },
  { month: "Jan", income: 14800, expense: 5100 },
  { month: "Feb", income: 15200, expense: 4600 },
  { month: "Mar", income: 15500, expense: 4980 },
];