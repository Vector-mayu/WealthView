import { useDispatch, useSelector } from "react-redux";
import { Home, CreditCard, BarChart2, Sparkles, LogOut, User, ShieldCheck } from "lucide-react";
import { navigate, setRole, selectActivePage, selectRole, selectSidebarOpen, selectDark } from "../store/uiSlice";

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",         Icon: Home       },
  { id: "transaction", label: "Transactions",       Icon: CreditCard },
  { id: "insights",    label: "Financial Insights", Icon: BarChart2  },
  { id: "wealthai",    label: "WealthAI Coach",     Icon: Sparkles   },
];

export default function Sidebar() {
  const dispatch    = useDispatch();
  const activePage  = useSelector(selectActivePage);
  const role        = useSelector(selectRole);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const dark        = useSelector(selectDark);

  return (
    <>
      {/* Sidebar panel */}
      <aside className={`flex-shrink-0 flex flex-col transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        bg-white dark:bg-wv-sidebar border-r border-gray-200 dark:border-wv-border
        ${sidebarOpen ? "w-[232px]" : "w-0"} overflow-hidden`}>

        <div className="w-[232px] flex flex-col h-full">

          {/* Profile */}
          <div className="px-3.5 pt-5 pb-4 border-b border-gray-200 dark:border-wv-border flex-shrink-0">
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[58px] h-[58px] rounded-[18px] bg-wv-green/10
                border-2 border-wv-green/30 flex items-center justify-center">
                {role === "admin"
                  ? <ShieldCheck size={25} className="text-wv-green" />
                  : <User        size={25} className="text-wv-green" />}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-wv-green
                  border-2 border-white dark:border-wv-sidebar" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-gray-900 dark:text-wv-primary">
                  {role === "admin" ? "Admin User" : "Mayuresh Dandekar"}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-wv-secondary mt-0.5">
                  {role === "admin" ? "Administrator" : "Premium Member"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2.5 overflow-y-auto">
            <p className="text-[10px] font-bold text-gray-400 dark:text-wv-secondary uppercase tracking-widest mb-2 px-1">
              Navigation
            </p>

            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = activePage === id;
              const isAI     = id === "wealthai";
              return (
                <button key={id} onClick={() => dispatch(navigate(id))}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl border-none
                    cursor-pointer mb-0.5 text-sm font-semibold transition-all duration-200
                    ${isActive
                      ? isAI
                        ? "bg-gradient-to-br from-violet-600 to-wv-purple text-white shadow-lg shadow-wv-purple/25"
                        : "bg-gradient-to-br from-wv-green to-wv-green-dark text-white shadow-lg shadow-wv-green/25"
                      : "bg-transparent text-gray-500 dark:text-wv-secondary hover:bg-black/[.04] dark:hover:bg-white/[.05] hover:text-gray-800 dark:hover:text-wv-primary"
                    }`}>
                  <Icon size={15} />
                  {label}
                  {isAI && !isActive && (
                    <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full
                      bg-wv-purple/15 text-wv-purple tracking-wider">AI</span>
                  )}
                </button>
              );
            })}

            {/* Role Switcher */}
            <div className="mt-4 p-3 rounded-xl bg-black/[.03] dark:bg-white/[.04] border border-gray-200 dark:border-wv-border">
              <p className="text-[10px] font-bold text-gray-400 dark:text-wv-secondary uppercase tracking-widest mb-2">Role</p>
              <div className="flex gap-1.5">
                {["user", "admin"].map(r => (
                  <button key={r} onClick={() => dispatch(setRole(r))}
                    className={`flex-1 py-1.5 rounded-lg border-none cursor-pointer text-xs font-bold capitalize transition-all
                      ${role === r
                        ? "bg-gradient-to-br from-wv-green to-wv-green-dark text-white shadow-md shadow-wv-green/20"
                        : "bg-black/[.04] dark:bg-white/[.07] text-gray-500 dark:text-wv-secondary hover:bg-black/[.07] dark:hover:bg-white/10"}`}>
                    {r}
                  </button>
                ))}
              </div>
              <p className={`text-[11px] font-semibold mt-2 ${role === "admin" ? "text-wv-green" : "text-gray-400 dark:text-wv-secondary"}`}>
                {role === "admin" ? "✓ Edit access enabled" : "👁 View-only access"}
              </p>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-2.5 border-t border-gray-200 dark:border-wv-border flex-shrink-0">
            <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl border-none
              cursor-pointer bg-transparent text-wv-red text-sm font-semibold
              hover:bg-wv-red/10 transition-colors">
              <LogOut size={15} />Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}