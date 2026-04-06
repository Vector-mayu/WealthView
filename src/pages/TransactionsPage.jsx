import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search, Plus, Pencil, Trash2, X, ArrowUpDown,
  Calendar, FileText, Filter, TrendingUp, TrendingDown,
  Wallet, Upload, SlidersHorizontal,
} from "lucide-react";
import {
  addTransaction, updateTransaction, deleteTransaction,
  importTransactions, setFilter, resetFilters,
  selectFilteredTransactions, selectAllTransactions,
  selectFilters, selectFinancials,
} from "../store/transactionSlice";
import { selectRole, selectDark, showToast } from "../store/uiSlice";
import { TxModal, DeleteModal, ImportModal, Select } from "../components/UI";
import { fmt, fmtDate, getCatCfg, ALL_CATEGORIES } from "../utils/constants";

// ─── SUMMARY STRIP ────────────────────────────────────────────────────────────
function SummaryStrip({ txs }) {
  const inc = txs.filter(t => t.type === "income" ).reduce((s, t) => s + t.amount, 0);
  const exp = txs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const net = inc - exp;
  const items = [
    { label: "Total Income",   val: inc, c: "text-wv-green",  bg: "bg-wv-green/10",  Icon: TrendingUp   },
    { label: "Total Expenses", val: exp, c: "text-wv-red",    bg: "bg-wv-red/10",    Icon: TrendingDown  },
    { label: "Net Balance",    val: net, c: net >= 0 ? "text-wv-green" : "text-wv-red",
      bg: net >= 0 ? "bg-wv-green/10" : "bg-wv-red/10", Icon: Wallet },
  ];
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-3.5">
      {items.map(({ label, val, c, bg, Icon }) => (
        <div key={label}
          className="wv-card p-3 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/25 transition-all duration-200">
          <div className={`p-2 rounded-xl flex-shrink-0 ${bg}`}>
            <Icon size={15} className={c} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-500 dark:text-wv-secondary font-medium truncate">{label}</p>
            <p className={`text-sm font-bold ${c} truncate`}>{fmt(Math.abs(val))}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const dispatch  = useDispatch();
  const all       = useSelector(selectAllTransactions);
  const displayed = useSelector(selectFilteredTransactions);
  const filters   = useSelector(selectFilters);
  const role      = useSelector(selectRole);
  const dark      = useSelector(selectDark);

  const [modal,      setModal]      = useState({ open: false, tx: null });
  const [delTarget,  setDelTarget]  = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const isFiltered = filters.search || filters.category !== "All" || filters.type !== "All";

  const handleSave = (form) => {
    const entry = { ...form, amount: parseFloat(form.amount) };
    if (form.id) {
      dispatch(updateTransaction(entry));
      dispatch(showToast({ msg: "Transaction updated!", type: "success" }));
    } else {
      dispatch(addTransaction(entry));
      dispatch(showToast({ msg: "Transaction added!", type: "success" }));
    }
    setModal({ open: false, tx: null });
  };

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
    dispatch(showToast({ msg: "Transaction deleted.", type: "success" }));
    setDelTarget(null);
  };

  const handleImport = (rows) => {
    dispatch(importTransactions(rows));
    dispatch(showToast({ msg: `${rows.length} transactions imported!`, type: "success" }));
  };

  return (
    <div>
      {/* Modals */}
      <TxModal open={modal.open} onClose={() => setModal({ open: false, tx: null })} onSave={handleSave} initial={modal.tx} />
      <DeleteModal tx={delTarget} onConfirm={handleDelete} onCancel={() => setDelTarget(null)} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />

      {/* Page Header */}
      <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-wv-primary tracking-tight">Transactions</h1>
          <p className="text-xs text-gray-500 dark:text-wv-secondary mt-1">
            Showing {displayed.length} of {all.length} transactions
            {filters.category !== "All" && <span className="text-wv-green font-semibold"> · {filters.category}</span>}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setImportOpen(true)} className="wv-btn-ghost text-xs px-3 py-2">
            <Upload size={13} />Import
          </button>
          {role === "admin" && (
            <button onClick={() => setModal({ open: true, tx: null })} className="wv-btn-primary text-xs">
              <Plus size={14} />Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Summary Strip */}
      <SummaryStrip txs={displayed} />

      {/* Filter Bar */}
      <div className="wv-card p-3.5 mb-3.5">
        <div className="flex gap-2.5 mb-0 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[180px] relative flex items-center">
            <Search size={14} className="absolute left-3 text-gray-400 dark:text-wv-secondary pointer-events-none" />
            <input
              value={filters.search}
              onChange={e => dispatch(setFilter({ key: "search", value: e.target.value }))}
              placeholder="        Search description or category..."
              className="wv-input pl-9 pr-9"
            />
            {filters.search && (
              <button onClick={() => dispatch(setFilter({ key: "search", value: "" }))}
                className="absolute right-2.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-wv-primary">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button onClick={() => setFilterOpen(f => !f)}
            className={`sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors
              ${filterOpen
                ? "border-wv-green bg-wv-green/10 text-wv-green"
                : "border-gray-200 dark:border-wv-border bg-gray-50 dark:bg-wv-input text-gray-500 dark:text-wv-secondary"}`}>
            <SlidersHorizontal size={13} />Filters
          </button>
        </div>

        {/* Filter selects */}
        <div className={`flex gap-2.5 flex-wrap items-center ${filterOpen ? "mt-2.5" : "hidden sm:flex mt-2.5"}`}>
          <Select value={filters.category} onChange={e => dispatch(setFilter({ key: "category", value: e.target.value }))}>
            <option value="All">All Categories</option>
            {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </Select>
          <Select value={filters.type} onChange={e => dispatch(setFilter({ key: "type", value: e.target.value }))}>
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </Select>
          <Select value={filters.sortBy} onChange={e => dispatch(setFilter({ key: "sortBy", value: e.target.value }))}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Amount: High → Low</option>
            <option value="low">Amount: Low → High</option>
          </Select>

          {isFiltered && (
            <button onClick={() => dispatch(resetFilters())}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer
                border border-wv-red/30 bg-wv-red/8 text-wv-red hover:bg-wv-red/15 transition-colors">
              <X size={11} />Clear
            </button>
          )}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 dark:text-wv-secondary whitespace-nowrap">
            <ArrowUpDown size={11} />{displayed.length} result{displayed.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="wv-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 560 }}>
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[.04]">
                {["Date", "Description", "Category", "Amount", "Type", ...(role === "admin" ? ["Actions"] : [])].map((h, i) => (
                  <th key={h}
                    className={`px-3.5 py-3 text-[10px] font-bold text-gray-400 dark:text-wv-secondary uppercase tracking-widest
                      border-b border-gray-100 dark:border-wv-border whitespace-nowrap
                      ${i >= 3 ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 6 : 5} className="py-14 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/[.05] flex items-center justify-center mx-auto mb-3">
                      {isFiltered ? <Filter size={20} className="text-gray-400 dark:text-wv-secondary" />
                                  : <FileText size={20} className="text-gray-400 dark:text-wv-secondary" />}
                    </div>
                    <p className="font-bold text-sm text-gray-700 dark:text-wv-primary mb-1">
                      {isFiltered ? "No results found" : "No transactions yet"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-wv-secondary">
                      {isFiltered ? "Try adjusting your filters." : "Add or import transactions to get started."}
                    </p>
                  </td>
                </tr>
              ) : displayed.map((tx, i) => {
                const { tailwind: catCls, hex } = getCatCfg(tx.category);
                const isIncome = tx.type === "income";
                return (
                  <tr key={tx.id}
                    className={`wv-row-hover ${i < displayed.length - 1 ? "border-b border-gray-100 dark:border-wv-border" : ""}`}>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-gray-400 dark:text-wv-secondary" />
                        <span className="text-xs text-gray-400 dark:text-wv-secondary">{fmtDate(tx.date)}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 max-w-[180px]">
                      <span className="text-sm font-semibold text-gray-800 dark:text-wv-primary truncate block">{tx.description}</span>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className={`wv-badge text-[11px] ${catCls}`}>{tx.category}</span>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span className={`text-sm font-bold ${isIncome ? "text-wv-green" : "text-wv-red"}`}>
                        {isIncome ? "+" : "−"}{fmt(tx.amount)}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span className={`wv-badge text-[11px] ${isIncome ? "bg-wv-green/10 text-wv-green" : "bg-wv-red/10 text-wv-red"}`}>
                        {isIncome ? "Income" : "Expense"}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex gap-1.5 justify-center">
                          <button onClick={() => setModal({ open: true, tx: { ...tx } })}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer
                              border border-gray-200 dark:border-wv-border bg-transparent text-gray-500 dark:text-wv-secondary
                              hover:border-wv-blue hover:text-wv-blue hover:bg-wv-blue/8 transition-all">
                            <Pencil size={11} />Edit
                          </button>
                          <button onClick={() => setDelTarget(tx)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer
                              border border-gray-200 dark:border-wv-border bg-transparent text-gray-500 dark:text-wv-secondary
                              hover:border-wv-red hover:text-wv-red hover:bg-wv-red/8 transition-all">
                            <Trash2 size={11} />Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {displayed.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-wv-border flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs text-gray-400 dark:text-wv-secondary">
              {displayed.length} transaction{displayed.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-4 text-xs text-gray-400 dark:text-wv-secondary">
              <span>Income: <strong className="text-wv-green">{fmt(displayed.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0))}</strong></span>
              <span>Expense: <strong className="text-wv-red">{fmt(displayed.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0))}</strong></span>
            </div>
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}