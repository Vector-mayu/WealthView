import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Wallet, TrendingUp, TrendingDown, Percent, Building2, ShoppingCart, Utensils, Zap } from "lucide-react";
import { selectAllTransactions, selectFinancials } from "../store/transactionSlice";
import { navigate, selectDark } from "../store/uiSlice";
import { fmt, fmtDateShort, MONTHLY_CHART, FINANCIAL_THOUGHTS } from "../utils/constants";

const CAT_DONUT = [
  { name: "Rent",      amount: 2000, pct: 40, hex: "#10b981", Icon: Building2,    desc: "Monthly rental"   },
  { name: "Groceries", amount: 1200, pct: 24, hex: "#3b82f6", Icon: ShoppingCart, desc: "Weekly groceries" },
  { name: "Food",      amount: 980,  pct: 20, hex: "#f59e0b", Icon: Utensils,     desc: "Dining & takeaway"},
  { name: "Utilities", amount: 800,  pct: 16, hex: "#8b5cf6", Icon: Zap,          desc: "Bills & internet" },
];

const TipStyle = (dark) => ({
  background: dark ? "#152133" : "#fff",
  border: `1px solid ${dark ? "#1e3248" : "#e2e8f0"}`,
  borderRadius: 10, fontSize: 12,
  color: dark ? "#e8f0f8" : "#0f172a",
  fontFamily: "DM Sans, sans-serif",
});
const TickStyle = (dark) => ({ fontSize: 10, fill: dark ? "#7a90aa" : "#94a3b8", fontFamily: "DM Sans, sans-serif" });

export default function DashboardPage() {
  const dispatch       = useDispatch();
  const transactions   = useSelector(selectAllTransactions);
  const { income, expense, savings, savingsRate } = useSelector(selectFinancials);
  const dark           = useSelector(selectDark);

  const [thoughtIdx, setThoughtIdx] = useState(0);
  const [thoughtVis, setThoughtVis] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setThoughtVis(false);
      setTimeout(() => { setThoughtIdx(i => (i + 1) % FINANCIAL_THOUGHTS.length); setThoughtVis(true); }, 400);
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const CARDS = [
    { label: "Total Balance",   val: fmt(Math.max(0, savings)), Icon: Wallet,       hex: "#10b981", bg: "bg-wv-green/10",  trend: "+5.2%", up: true  },
    { label: "Monthly Income",  val: fmt(income),               Icon: TrendingUp,   hex: "#3b82f6", bg: "bg-wv-blue/10",   trend: "+2.1%", up: true  },
    { label: "Monthly Expense", val: fmt(expense),              Icon: TrendingDown, hex: "#f43f5e", bg: "bg-wv-red/10",    trend: "-1.3%", up: false },
    { label: "Saving Rate",     val: `${savingsRate}%`,         Icon: Percent,      hex: "#8b5cf6", bg: "bg-wv-purple/10", trend: "+3.4%", up: true  },
  ];

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {CARDS.map(({ label, val, Icon, hex, bg, trend, up }) => (
          <div key={label}
            className="wv-card p-4 cursor-default hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-xl ${bg}`}>
                <Icon size={15} style={{ color: hex }} />
              </div>
              <span className={`wv-badge text-[11px] ${up ? "bg-wv-green/10 text-wv-green" : "bg-wv-red/10 text-wv-red"}`}>
                {trend}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-wv-secondary font-medium mb-1">{label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-wv-primary">{val}</p>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3.5 mb-3.5">

        {/* Recent Transactions */}
        <div className="wv-card p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-wv-primary">Recent Transactions</h3>
              <p className="text-xs text-gray-500 dark:text-wv-secondary mt-0.5">{transactions.length} total this period</p>
            </div>
            <button onClick={() => dispatch(navigate("transaction"))}
              className="text-xs font-bold text-wv-green px-3 py-1.5 rounded-lg border border-gray-200
                dark:border-wv-border bg-transparent hover:bg-wv-green/10 transition-colors cursor-pointer">
              View All →
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[90px_1fr_1fr_80px] px-3 py-2 rounded-t-xl
            bg-gray-50 dark:bg-white/[.04] text-[10px] font-bold text-gray-400 dark:text-wv-secondary uppercase tracking-widest">
            {["Date", "Amount", "Category", "Type"].map(h => <span key={h}>{h}</span>)}
          </div>
          <div className="overflow-y-auto max-h-[200px] border border-gray-100 dark:border-wv-border border-t-0 rounded-b-xl">
            {recent.map((tx, i) => (
              <div key={tx.id}
                className={`grid grid-cols-[90px_1fr_1fr_80px] px-3 py-2.5 items-center wv-row-hover
                  ${i < recent.length - 1 ? "border-b border-gray-100 dark:border-wv-border" : ""}`}>
                <span className="text-[11px] text-gray-400 dark:text-wv-secondary">{fmtDateShort(tx.date)}</span>
                <span className={`text-sm font-bold ${tx.type === "income" ? "text-wv-green" : "text-wv-red"}`}>
                  {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                </span>
                <span className="text-xs text-gray-700 dark:text-wv-primary truncate">{tx.category}</span>
                <span className={`wv-badge text-[10px] inline-block
                  ${tx.type === "income" ? "bg-wv-green/10 text-wv-green" : "bg-wv-red/10 text-wv-red"}`}>
                  {tx.type === "income" ? "Income" : "Expense"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Overview Chart */}
        <div className="wv-card p-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-wv-primary mb-0.5">Monthly Overview</h3>
          <p className="text-xs text-gray-500 dark:text-wv-secondary mb-3">6-month trend</p>
          <ResponsiveContainer width="100%" height={182}>
            <LineChart data={MONTHLY_CHART} margin={{ top: 5, right: 5, left: -22, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e3248" : "#e2e8f0"} />
              <XAxis dataKey="month" tick={TickStyle(dark)} axisLine={false} tickLine={false} />
              <YAxis tick={TickStyle(dark)} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip contentStyle={TipStyle(dark)} formatter={(v, n) => [`₹${v.toLocaleString("en-IN")}`, n === "income" ? "Income" : "Expense"]} />
              <Line type="monotone" dataKey="income"  stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} dot={{ fill: "#f43f5e", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            {[{ l: "Income", c: "#10b981" }, { l: "Expense", c: "#f43f5e" }].map(({ l, c }) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-wv-secondary">
                <div className="w-3 h-0.5 rounded" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3.5">

        {/* Top 4 Categories */}
        <div className="wv-card p-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-wv-primary mb-0.5">Top 4 Categories</h3>
          <p className="text-xs text-gray-500 dark:text-wv-secondary mb-3">Highest spend this month</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CAT_DONUT.map(({ name, amount, pct, hex, Icon, desc }) => (
              <div key={name}
                onClick={() => dispatch(navigate("transaction"))}
                className="p-3 rounded-xl border border-gray-200 dark:border-wv-border cursor-pointer
                  hover:-translate-y-0.5 transition-all duration-200 group"
                style={{ "--hw": hex }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = hex; e.currentTarget.style.background = `${hex}0f`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.background = ""; }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${hex}1a` }}>
                    <Icon size={14} style={{ color: hex }} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-800 dark:text-wv-primary">{name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-wv-secondary">{desc}</p>
                  </div>
                </div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-bold text-sm text-gray-900 dark:text-wv-primary">{fmt(amount)}</span>
                  <span className="text-xs font-bold" style={{ color: hex }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/[.07]">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${hex},${hex}88)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="wv-card p-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-wv-primary mb-0.5">Expense Split</h3>
          <p className="text-xs text-gray-500 dark:text-wv-secondary mb-2">Category-wise breakdown</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={178}>
              <PieChart>
                <Pie data={CAT_DONUT} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="amount">
                  {CAT_DONUT.map(c => <Cell key={c.name} fill={c.hex} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={TipStyle(dark)} formatter={v => [fmt(v)]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-base font-extrabold text-gray-900 dark:text-wv-primary leading-tight">₹4,980</p>
              <p className="text-[10px] text-gray-400 dark:text-wv-secondary">Total Spent</p>
            </div>
          </div>
          <div className="space-y-2 mt-1">
            {CAT_DONUT.map(c => (
              <div key={c.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.hex }} />
                  <span className="text-gray-500 dark:text-wv-secondary">{c.name}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 dark:text-wv-secondary">{fmt(c.amount)}</span>
                  <span className="font-bold w-8 text-right" style={{ color: c.hex }}>{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}