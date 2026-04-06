import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  PiggyBank, Activity, Calendar, TrendingUp, TrendingDown,
  ShoppingBag, Zap, Target, BarChart2, Info,
} from "lucide-react";
import { selectAllTransactions, selectFinancials } from "../store/transactionSlice";
import { fmt, getCatCfg } from "../utils/constants";

// ─── STATUS HELPERS ────────────────────────────────────────────────────────────
const STATUS = {
  good:    { badge: "bg-wv-green/10 text-wv-green",   border: "border-l-wv-green",   glow: "bg-wv-green/8",   label: "Excellent" },
  ok:      { badge: "bg-wv-amber/10 text-wv-amber",   border: "border-l-wv-amber",   glow: "bg-wv-amber/8",   label: "Moderate"  },
  warn:    { badge: "bg-orange-500/10 text-orange-500",border: "border-l-orange-500", glow: "bg-orange-500/8", label: "Warning"   },
  bad:     { badge: "bg-wv-red/10 text-wv-red",       border: "border-l-wv-red",     glow: "bg-wv-red/8",     label: "Critical"  },
  neutral: { badge: "bg-wv-blue/10 text-wv-blue",     border: "border-l-wv-blue",    glow: "bg-wv-blue/8",    label: "Info"      },
};

// ─── INSIGHT CARD ──────────────────────────────────────────────────────────────
function InsightCard({ icon: Icon, iconColor, title, value, sub, status, detail }) {
  const s = STATUS[status] || STATUS.neutral;
  return (
    <div className={`wv-card p-4 border-l-4 ${s.border} relative overflow-hidden
      hover:-translate-y-0.5 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-200 group`}>
      {/* BG glow */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${s.glow} rounded-bl-[80px] rounded-tr-2xl pointer-events-none`} />

      <div className="flex justify-between items-start mb-3 relative">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${s.glow}`}>
            <Icon size={16} className={iconColor} />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-wv-secondary leading-tight">{title}</span>
        </div>
        <span className={`wv-badge text-[10px] ${s.badge} whitespace-nowrap`}>{s.label}</span>
      </div>

      <p className="text-2xl font-extrabold text-gray-900 dark:text-wv-primary mb-1 tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 dark:text-wv-secondary leading-relaxed">{sub}</p>

      {detail && (
        <div className="mt-3 p-2.5 rounded-xl bg-black/[.03] dark:bg-white/[.04] text-xs text-gray-500 dark:text-wv-secondary leading-relaxed">
          <span className="font-bold">💡 </span>{detail}
        </div>
      )}
    </div>
  );
}

// ─── CATEGORY BAR ──────────────────────────────────────────────────────────────
function CatBar({ name, amount, total, rank }) {
  const pct = total > 0 ? +((amount / total) * 100).toFixed(1) : 0;
  const { hex } = getCatCfg(name);
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold flex-shrink-0"
            style={{ background: `${hex}1a`, color: hex }}>#{rank}</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-wv-primary">{name}</span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-xs font-bold text-gray-700 dark:text-wv-primary">{fmt(amount)}</span>
          <span className="text-xs font-bold w-9 text-right" style={{ color: hex }}>{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-white/[.07] rounded-full">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${hex},${hex}88)` }} />
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const transactions = useSelector(selectAllTransactions);
  const { income, expense, savings, savingsRate } = useSelector(selectFinancials);

  const calc = useMemo(() => {
    if (!transactions?.length) return null;

    // Category breakdown
    const catMap = {}, catCount = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      catMap[t.category]   = (catMap[t.category]   || 0) + t.amount;
      catCount[t.category] = (catCount[t.category] || 0) + 1;
    });
    const sortedCats   = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const topCat       = sortedCats[0];
    const freqCat      = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
    const freqCount    = catCount[freqCat?.[0]] || 0;

    // Monthly comparison
    const now = new Date();
    const thisM = now.getMonth(), thisY = now.getFullYear();
    const prevM = thisM === 0 ? 11 : thisM - 1;
    const prevY = thisM === 0 ? thisY - 1 : thisY;

    const curExp  = transactions.filter(t => { const d = new Date(t.date); return t.type === "expense" && d.getMonth() === thisM && d.getFullYear() === thisY; }).reduce((s,t) => s+t.amount, 0);
    const prevExp = transactions.filter(t => { const d = new Date(t.date); return t.type === "expense" && d.getMonth() === prevM && d.getFullYear() === prevY; }).reduce((s,t) => s+t.amount, 0);
    const monthDiff = prevExp > 0 ? ((curExp - prevExp) / prevExp) * 100 : 0;

    // Daily avg
    const days   = [...new Set(transactions.filter(t => t.type === "expense").map(t => t.date))];
    const dailyAvg = days.length > 0 ? expense / days.length : 0;
    const expenseRatio = income > 0 ? (expense / income) * 100 : 100;

    return { topCat, sortedCats, freqCat, freqCount, curExp, prevExp, monthDiff, dailyAvg, expenseRatio };
  }, [transactions, income, expense]);

  if (!transactions?.length || !calc) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <BarChart2 size={44} className="text-gray-200 dark:text-wv-border mb-4" />
        <p className="font-bold text-sm text-gray-700 dark:text-wv-primary">No data to analyse</p>
        <p className="text-xs text-gray-400 dark:text-wv-secondary mt-1">Add transactions to see insights.</p>
      </div>
    );
  }

  const { topCat, sortedCats, freqCat, freqCount, curExp, prevExp, monthDiff, dailyAvg, expenseRatio } = calc;

  const savStatus = savingsRate >= 50 ? "good" : savingsRate >= 20 ? "ok" : "bad";
  const expStatus = expenseRatio <= 50 ? "good" : expenseRatio <= 70 ? "ok" : "bad";
  const monStatus = monthDiff <= 0 ? "good" : monthDiff <= 10 ? "ok" : "warn";

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-wv-primary tracking-tight">Financial Insights</h1>
        <p className="text-xs text-gray-500 dark:text-wv-secondary mt-1">Data-driven analysis of your spending and saving behaviour</p>
      </div>

      {/* Core Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <InsightCard icon={PiggyBank} iconColor="text-wv-green" title="Savings Rate" status={savStatus}
          value={`${savingsRate}%`} sub={`You save ${fmt(savings)} from ${fmt(income)} income`}
          detail={savingsRate >= 50 ? "Excellent! You're building wealth fast." : savingsRate >= 20 ? "Good discipline. Aim for 50%+ to accelerate growth." : "Below recommended. Cut non-essentials immediately."} />

        <InsightCard icon={Activity} iconColor="text-wv-blue" title="Expense vs Income" status={expStatus}
          value={`${expenseRatio.toFixed(1)}%`} sub={`${fmt(expense)} spent of ${fmt(income)} earned`}
          detail={expenseRatio > 70 ? "High expense ratio! Review fixed costs." : expenseRatio > 50 ? "Moderate. Look for 1–2 categories to reduce." : "Healthy! You're spending responsibly."} />

        <InsightCard icon={Calendar} iconColor="text-wv-amber" title="Daily Avg. Spending" status={dailyAvg > 1000 ? "warn" : dailyAvg > 500 ? "ok" : "good"}
          value={fmt(Math.round(dailyAvg))} sub="Average spent per active spending day"
          detail={dailyAvg > 1000 ? "High daily spend. Track daily to find leakages." : "Good daily spending control. Keep it up!"} />

        <InsightCard icon={monthDiff <= 0 ? TrendingDown : TrendingUp}
          iconColor={monthDiff <= 0 ? "text-wv-green" : "text-orange-500"}
          title="Month-over-Month" status={monStatus}
          value={`${Math.abs(monthDiff).toFixed(1)}% ${monthDiff <= 0 ? "↓" : "↑"}`}
          sub={`Mar: ${fmt(curExp)} vs Feb: ${fmt(prevExp)}`}
          detail={monthDiff <= 0 ? "Great! Expenses decreased vs last month." : monthDiff <= 10 ? "Slight increase. Keep an eye on variable spending." : "Significant rise. Review what changed this month."} />
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {topCat && (
          <InsightCard icon={ShoppingBag} iconColor="text-wv-amber" title="Highest Spending Category" status={topCat[1] / expense > 0.4 ? "warn" : "ok"}
            value={topCat[0]} sub={`${fmt(topCat[1])} · ${((topCat[1]/expense)*100).toFixed(1)}% of expenses`}
            detail={`${topCat[0]} is your biggest spend. Consider setting a monthly cap.`} />
        )}
        {freqCat && (
          <InsightCard icon={Zap} iconColor="text-wv-cyan" title="Most Frequent Category" status="neutral"
            value={freqCat[0]} sub={`${freqCount} transactions · most recurring spend`}
            detail="Frequent small purchases add up fast. Review if all are necessary." />
        )}
        <InsightCard icon={Target} iconColor={savings >= 0 ? "text-wv-green" : "text-wv-red"} title="Monthly Net Savings"
          status={savings >= 0 ? (savings > income * 0.3 ? "good" : "ok") : "bad"}
          value={savings >= 0 ? fmt(savings) : `-${fmt(Math.abs(savings))}`}
          sub={savings >= 0 ? "Net savings this period" : "Overspending this period"}
          detail={savings >= 0 ? `At this rate, you'll save ${fmt(savings * 12)} annually.` : "Overspending detected. Immediate budget review needed."} />
      </div>

      {/* Category Breakdown */}
      <div className="wv-card p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-wv-primary">Category Breakdown</h3>
            <p className="text-xs text-gray-500 dark:text-wv-secondary mt-0.5">All expense categories ranked by spend</p>
          </div>
          <span className="wv-badge bg-wv-green/10 text-wv-green text-[11px]">{sortedCats.length} categories</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {sortedCats.map(([name, amount], i) => (
            <CatBar key={name} name={name} amount={amount} total={expense} rank={i + 1} />
          ))}
        </div>
      </div>

      {/* Advice Banner */}
      <div className="rounded-2xl p-4 border border-wv-green/20 bg-gradient-to-br from-wv-green/8 to-wv-green-dark/4 flex gap-3 items-start">
        <div className="p-2 rounded-xl bg-wv-green/15 flex-shrink-0 mt-0.5">
          <Info size={16} className="text-wv-green" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900 dark:text-wv-primary mb-1.5">Personalised Recommendation</p>
          <p className="text-xs text-gray-500 dark:text-wv-secondary leading-relaxed">
            {savingsRate >= 50
              ? `You're doing great! Your ${savingsRate}% saving rate is above the 50% benchmark. Consider investing your surplus ${fmt(savings)} into SIPs or index funds for wealth creation.`
              : savingsRate >= 20
              ? `Your ${savingsRate}% saving rate is decent but there's room to improve. Focus on reducing "${topCat?.[0]}" expenses (${fmt(topCat?.[1] || 0)}) and aim for 50% savings.`
              : `Your saving rate of ${savingsRate}% needs immediate attention. Cut discretionary spending, especially in "${topCat?.[0]}". Try the 50/30/20 budgeting rule.`}
          </p>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}