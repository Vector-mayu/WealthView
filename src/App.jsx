import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, Sun, Moon, Menu, X, Sparkles, MessageCircle } from "lucide-react";
import { toggleDark, toggleSidebar, selectDark, selectActivePage, selectSidebarOpen, navigate } from "./store/uiSlice";
import { selectAllTransactions, selectFinancials } from "./store/transactionSlice";
import Sidebar from "./components/Sidebar";
import WealthAI from "./components/WealthAI";
import { Toast } from "./components/UI";
import DashboardPage    from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import InsightsPage     from "./pages/InsightsPage";
import { FINANCIAL_THOUGHTS } from "./utils/constants";

// ─── LOADING SCREEN ────────────────────────────────────────────────────────────
function LoadingScreen({ fadeOut }) {
  return (
    <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#080f1a]
      transition-opacity duration-500 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-wv-green to-wv-green-dark
        flex items-center justify-center mb-5 animate-pulse2 shadow-2xl shadow-wv-green/40">
        <Wallet size={30} className="text-white" />
      </div>
      <h1 className="text-3xl font-extrabold text-wv-green tracking-tight mb-2">WealthView</h1>
      <p className="text-sm text-[#4a6278]">Loading your financial dashboard...</p>
      <div className="flex gap-2 mt-6">
        <span className="w-2.5 h-2.5 rounded-full bg-wv-green animate-bounce3-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-wv-green animate-bounce3-1" />
        <span className="w-2.5 h-2.5 rounded-full bg-wv-green animate-bounce3-2" />
      </div>
    </div>
  );
}

// ─── WEALTHAI LANDING PAGE ─────────────────────────────────────────────────────
function WealthAIPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-sm">
        <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-wv-green-dark to-wv-green
          flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-wv-green/30">
          <Sparkles size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-wv-primary tracking-tight mb-2">WealthAI Coach</h2>
        <p className="text-sm text-gray-500 dark:text-wv-secondary leading-relaxed mb-6">
          Your personal AI-powered financial coach — ready to help you understand spending,
          optimise savings, and make smarter money decisions.
        </p>

        <div className="wv-card p-4 text-left mb-5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-wv-secondary uppercase tracking-widest mb-3">Try asking:</p>
          {[
            "What is my current saving rate?",
            "Where am I spending the most?",
            "How can I save more this month?",
            "Give me my financial health overview",
          ].map(q => (
            <div key={q} className="text-sm text-gray-700 dark:text-wv-primary px-3 py-2.5 rounded-xl mb-2
              bg-wv-green/5 border border-wv-green/15 leading-snug">
              💬 {q}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
          bg-wv-green/10 border border-wv-green/20 text-wv-green text-sm font-semibold">
          <MessageCircle size={16} />
          Click the chat bubble at bottom-right to start!
        </div>
      </div>
    </div>
  );
}

// ─── APP INNER (has access to Redux) ──────────────────────────────────────────
function AppInner() {
  const dispatch    = useDispatch();
  const dark        = useSelector(selectDark);
  const activePage  = useSelector(selectActivePage);
  const sidebarOpen = useSelector(selectSidebarOpen);

  const [loading,    setLoading]    = useState(true);
  const [fadeOut,    setFadeOut]    = useState(false);
  const [thoughtIdx, setThoughtIdx] = useState(0);
  const [thoughtVis, setThoughtVis] = useState(true);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 640);

  // Apply dark class to html element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Loading
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1800);
    const t2 = setTimeout(() => setLoading(false), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Resize
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Thought rotation
  useEffect(() => {
    const iv = setInterval(() => {
      setThoughtVis(false);
      setTimeout(() => { setThoughtIdx(i => (i + 1) % FINANCIAL_THOUGHTS.length); setThoughtVis(true); }, 400);
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-wv-base text-gray-900 dark:text-wv-primary font-sans">
      {loading && <LoadingScreen fadeOut={fadeOut} />}
      <Toast />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 flex items-center gap-3 px-5 py-3
        bg-white dark:bg-wv-sidebar border-b border-gray-200 dark:border-wv-border
        backdrop-blur-lg">

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-wv-green to-wv-green-dark
            flex items-center justify-center shadow-md shadow-wv-green/30">
            <Wallet size={15} className="text-white" />
          </div>
          <span className="font-bold text-[1.05rem] text-wv-green tracking-tight">WealthView</span>
        </div>

        {/* Rotating Thought */}
        {!isMobile && (
          <div className={`flex-1 text-center overflow-hidden transition-all duration-400
            ${thoughtVis ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
            <p className="text-xs text-gray-500 dark:text-wv-secondary italic truncate">
              "{FINANCIAL_THOUGHTS[thoughtIdx].text}"
              <span className="text-wv-green not-italic font-bold ml-1.5">
                — {FINANCIAL_THOUGHTS[thoughtIdx].author}
              </span>
            </p>
          </div>
        )}
        {isMobile && <div className="flex-1" />}

        {/* Controls */}
        <div className="flex gap-1.5 flex-shrink-0">
          <button onClick={() => dispatch(toggleDark())}
            className="p-1.5 rounded-[9px] border-none cursor-pointer bg-gray-100 dark:bg-wv-hover transition-colors
              hover:bg-gray-200 dark:hover:bg-wv-border flex items-center justify-center">
            {dark ? <Sun size={15} className="text-wv-amber" /> : <Moon size={15} className="text-gray-500" />}
          </button>
          <button onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-[9px] border-none cursor-pointer bg-gray-100 dark:bg-wv-hover transition-colors
              hover:bg-gray-200 dark:hover:bg-wv-border flex items-center justify-center">
            {sidebarOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex" style={{ height: "calc(100vh - 57px)" }}>

        {/* Sidebar */}
        <Sidebar />

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => dispatch(toggleSidebar())}
            className="fixed inset-0 top-[57px] z-[49] bg-black/50 backdrop-blur-sm animate-fade-in" />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0 px-4 py-5 sm:px-6">
          {activePage === "dashboard"   && <DashboardPage />}
          {activePage === "transaction" && <TransactionsPage />}
          {activePage === "insights"    && <InsightsPage />}
          {activePage === "wealthai"    && <WealthAIPage />}
        </main>
      </div>

      {/* WealthAI Floating Chatbot */}
      <WealthAI />
    </div>
  );
}

export default AppInner;