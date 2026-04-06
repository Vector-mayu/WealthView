import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, X, Send, Sparkles, TrendingUp, PiggyBank, BarChart2, ChevronDown, Loader2 } from "lucide-react";
import { selectAllTransactions, selectFinancials } from "../store/transactionSlice";
import { selectDark } from "../store/uiSlice";
import { fmt } from "../utils/constants";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const QUICK = [
  { label: "Saving Rate",      Icon: PiggyBank,  q: "What is my current saving rate?"             },
  { label: "Top Spending",     Icon: BarChart2,  q: "Where am I spending the most?"               },
  { label: "Save More",        Icon: TrendingUp, q: "How can I save more money this month?"        },
  { label: "Health Overview",  Icon: Sparkles,   q: "Give me an overview of my financial health."  },
];

function buildContext(transactions, financials) {
  const { income, expense, savings, savingsRate } = financials;
  const catMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([c, v]) => `${c}: ₹${v.toLocaleString("en-IN")}`).join(", ");

  return `You are WealthAI, a friendly and concise financial coach inside the WealthView dashboard.
User's current financial data:
- Total Income: ₹${income.toLocaleString("en-IN")}
- Total Expenses: ₹${expense.toLocaleString("en-IN")}
- Net Savings: ₹${savings.toLocaleString("en-IN")}
- Saving Rate: ${savingsRate}%
- Top Spending Categories: ${topCats}
- Total Transactions: ${transactions.length}

Rules: Keep responses SHORT (2-4 sentences) unless asked for detail. Use ₹ for currency with exact numbers. Be encouraging and actionable. Use emojis sparingly. If asked something non-financial, politely redirect.`;
}

// Render **bold** markdown
function RenderText({ text }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((seg, i) =>
        seg.startsWith("**") && seg.endsWith("**")
          ? <strong key={i} className="font-bold">{seg.slice(2, -2)}</strong>
          : seg
      )}
    </>
  );
}

export default function WealthAI() {
  const transactions = useSelector(selectAllTransactions);
  const financials   = useSelector(selectFinancials);
  const dark         = useSelector(selectDark);

  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "Hi! I'm **WealthAI** 👋 Your personal financial coach. Ask me anything about your spending, savings, or how to improve your finances!", id: 0 }]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const historyRef = useRef([]);
  const msgId      = useRef(1);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: q, id: msgId.current++ }]);
    setLoading(true);
    historyRef.current.push({ role: "user", parts: [{ text: q }] });

    try {
      if (!GEMINI_KEY) throw new Error("no_key");
      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildContext(transactions, financials) }] },
          contents: historyRef.current.slice(-10),
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      });
      if (!res.ok) throw new Error(`api_${res.status}`);
      const data  = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that. Please try again.";
      historyRef.current.push({ role: "model", parts: [{ text: reply }] });
      setMessages(m => [...m, { role: "bot", text: reply, id: msgId.current++ }]);
    } catch (e) {
      const msg = e.message === "no_key"
        ? "⚠️ Add VITE_GEMINI_API_KEY to your .env file to enable WealthAI."
        : "⚠️ Network error. Please try again.";
      setMessages(m => [...m, { role: "bot", text: msg, isError: true, id: msgId.current++ }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-[84px] right-5 z-[500] w-[340px] max-h-[520px]
          bg-white dark:bg-wv-card border border-gray-200 dark:border-wv-border rounded-[20px]
          shadow-2xl dark:shadow-black/50 flex flex-col overflow-hidden animate-chat-up">

          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-br from-wv-green-dark to-wv-green flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-white leading-tight">WealthAI</p>
              <p className="text-[11px] text-white/75 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                Financial Coach · Online
              </p>
            </div>
            <button onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white border-none cursor-pointer flex transition-colors">
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 pt-3 pb-1 bg-gray-50 dark:bg-wv-base flex flex-col gap-2">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-msg-in`}>
                {m.role === "bot" && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-wv-green-dark to-wv-green flex items-center justify-center mr-1.5 mt-0.5 flex-shrink-0">
                    <Sparkles size={11} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[78%] px-3 py-2 text-[13px] leading-relaxed
                  ${m.role === "user"
                    ? "bg-gradient-to-br from-wv-green to-wv-green-dark text-white rounded-[14px_14px_4px_14px] font-medium"
                    : `bg-white dark:bg-wv-card border border-gray-100 dark:border-wv-border rounded-[14px_14px_14px_4px]
                       ${m.isError ? "text-wv-red" : "text-gray-800 dark:text-wv-primary"}`}`}>
                  <RenderText text={m.text} />
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex items-center gap-2 pl-8">
                <div className="bg-white dark:bg-wv-card border border-gray-100 dark:border-wv-border rounded-[14px_14px_14px_4px] px-3.5 py-2.5 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-wv-green animate-dot-0" />
                  <span className="w-1.5 h-1.5 rounded-full bg-wv-green animate-dot-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-wv-green animate-dot-2" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1.5 px-3 py-2 overflow-x-auto bg-gray-50 dark:bg-wv-base border-t border-gray-100 dark:border-wv-border flex-shrink-0">
            {QUICK.map(({ label, Icon, q }) => (
              <button key={label} onClick={() => send(q)} disabled={loading}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full whitespace-nowrap text-[11px] font-semibold
                  border border-gray-200 dark:border-wv-border bg-white dark:bg-wv-card
                  text-gray-500 dark:text-wv-secondary flex-shrink-0 cursor-pointer transition-colors
                  hover:border-wv-green hover:text-wv-green
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                <Icon size={10} />{label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 px-3 py-2.5 bg-white dark:bg-wv-card border-t border-gray-100 dark:border-wv-border flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about your finances..."
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-wv-border
                bg-gray-50 dark:bg-wv-base text-gray-800 dark:text-wv-primary text-[13px] outline-none
                focus:border-wv-green transition-colors"
            />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              className={`w-9 h-9 rounded-xl border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-all
                ${(!input.trim() || loading)
                  ? "bg-gray-100 dark:bg-wv-hover cursor-not-allowed"
                  : "bg-gradient-to-br from-wv-green to-wv-green-dark shadow-md shadow-wv-green/25 hover:shadow-wv-green/40"}`}>
              {loading
                ? <Loader2 size={13} className="text-gray-400 animate-spin-slow" />
                : <Send size={13} className={!input.trim() ? "text-gray-400" : "text-white"} />}
            </button>
          </div>
        </div>
      )}

      <button
  onClick={() => setOpen(o => !o)}
  className={`fixed bottom-[20px] right-[20px] left-auto z-[9999]
    w-[54px] h-[54px] rounded-full border-none cursor-pointer
    flex items-center justify-center transition-all duration-300
    ${open
      ? "bg-gray-100 dark:bg-wv-hover scale-95"
      : "bg-gradient-to-br from-wv-green to-wv-green-dark shadow-xl shadow-wv-green/40 hover:scale-105 animate-pulse2"}`}
>
  {open ? (
    <X size={20} className="text-gray-500 dark:text-wv-secondary" />
  ) : (
    <MessageCircle size={22} className="text-white" />
  )}

  {!open && (
    <span
      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-wv-amber
        border-2 border-white dark:border-wv-base text-[9px] font-extrabold text-white
        flex items-center justify-center"
    >
      AI
    </span>
  )}
</button>
    </>
  );
}