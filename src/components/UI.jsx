import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, ChevronDown, CheckCircle2, AlertCircle, Upload, Table2, FileJson } from "lucide-react";
import { clearToast, selectToast } from "../store/uiSlice";
import { ALL_CATEGORIES, fmt } from "../utils/constants";

// ─── TOAST ────────────────────────────────────────────────────────────────────
export function Toast() {
  const dispatch = useDispatch();
  const toast    = useSelector(selectToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), 2800);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;
  const isErr = toast.type === "error";
  return (
    <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-2xl
      text-white text-sm font-semibold animate-slide-up shadow-2xl
      ${isErr ? "bg-gradient-to-br from-wv-red to-red-600 shadow-wv-red/30"
               : "bg-gradient-to-br from-wv-green to-wv-green-dark shadow-wv-green/30"}`}>
      {isErr ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
      {toast.msg}
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
export function Select({ value, onChange, children, className = "" }) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value} onChange={onChange}
        className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-wv-border
          bg-gray-50 dark:bg-wv-input text-gray-800 dark:text-wv-primary
          text-sm font-medium cursor-pointer outline-none w-full
          focus:border-wv-green transition-colors"
      >
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
export function ModalBackdrop({ onClose, children }) {
  return (
    <div onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4
        bg-black/60 backdrop-blur-sm animate-fade-in">
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// ─── TX FORM MODAL ────────────────────────────────────────────────────────────
const EMPTY = { date: "", description: "", category: "Food", amount: "", type: "expense" };

export function TxModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = !!(initial?.id);

  useEffect(() => { setForm(initial || EMPTY); }, [initial, open]);
  if (!open) return null;

  const valid = form.date && form.description.trim() && Number(form.amount) > 0;
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white dark:bg-wv-card border border-gray-200 dark:border-wv-border
        rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">

        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-wv-primary">
              {isEdit ? "Edit Transaction" : "Add Transaction"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-wv-secondary mt-0.5">
              {isEdit ? "Update transaction details" : "Fill in the details below"}
            </p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-wv-hover text-gray-500 dark:text-wv-secondary
              hover:bg-gray-200 dark:hover:bg-wv-border transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3.5">
          <Field label="Date" type="date" value={form.date} onChange={set("date")} />
          <Field label="Description" placeholder="e.g. Swiggy Dinner" value={form.description} onChange={set("description")} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-wv-secondary mb-1.5 tracking-wide">Category</label>
              <Select value={form.category} onChange={set("category")} className="w-full">
                {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-wv-secondary mb-1.5 tracking-wide">Type</label>
              <Select value={form.type} onChange={set("type")} className="w-full">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </div>
          </div>

          <Field label="Amount (₹)" type="number" placeholder="0" value={form.amount} onChange={set("amount")} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-wv-border
              bg-transparent text-gray-500 dark:text-wv-secondary font-semibold text-sm cursor-pointer
              hover:bg-gray-50 dark:hover:bg-wv-hover transition-colors">
            Cancel
          </button>
          <button disabled={!valid} onClick={() => valid && onSave(form)}
            className={`flex-1 py-2.5 rounded-xl border-none font-bold text-sm cursor-pointer transition-all
              ${valid
                ? "bg-gradient-to-br from-wv-green to-wv-green-dark text-white shadow-lg shadow-wv-green/25 hover:shadow-wv-green/40"
                : "bg-gray-100 dark:bg-wv-hover text-gray-400 dark:text-wv-secondary cursor-not-allowed"}`}>
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-wv-secondary mb-1.5 tracking-wide">{label}</label>
      <input className="wv-input" {...props} />
    </div>
  );
}

// ─── DELETE MODAL ─────────────────────────────────────────────────────────────
export function DeleteModal({ tx, onConfirm, onCancel }) {
  if (!tx) return null;
  return (
    <ModalBackdrop onClose={onCancel}>
      <div className="bg-white dark:bg-wv-card border border-gray-200 dark:border-wv-border
        rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scale-in">
        <div className="w-11 h-11 rounded-xl bg-wv-red/10 flex items-center justify-center mb-4">
          <span className="text-wv-red text-xl">🗑</span>
        </div>
        <h3 className="font-bold text-base text-gray-900 dark:text-wv-primary mb-2">Delete Transaction?</h3>
        <p className="text-sm text-gray-500 dark:text-wv-secondary leading-relaxed mb-6">
          Deleting <strong className="text-gray-800 dark:text-wv-primary">{tx.description}</strong> cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-wv-border
              bg-transparent text-gray-500 dark:text-wv-secondary font-semibold text-sm cursor-pointer
              hover:bg-gray-50 dark:hover:bg-wv-hover transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(tx.id)}
            className="flex-1 py-2.5 rounded-xl border-none bg-gradient-to-br from-wv-red to-red-600
              text-white font-bold text-sm cursor-pointer shadow-lg shadow-wv-red/25">
            Delete
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ─── IMPORT MODAL ─────────────────────────────────────────────────────────────
export function ImportModal({ open, onClose, onImport }) {
  const [drag,    setDrag]    = useState(false);
  const [preview, setPreview] = useState(null);
  const [error,   setError]   = useState("");
  const fileRef = useRef(null);
  const fullRef = useRef(null);

  if (!open) return null;

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const heads = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/['"]/g, ""));
    return lines.slice(1).filter(l => l.trim()).map((line, i) => {
      const vals = line.split(",").map(v => v.trim().replace(/['"]/g, ""));
      const o = {}; heads.forEach((h, j) => o[h] = vals[j] || "");
      return {
        date:        o.date || new Date().toISOString().slice(0, 10),
        description: o.description || o.desc || o.name || "Imported",
        category:    o.category || "Food",
        amount:      parseFloat(o.amount || 0),
        type:        (o.type || "expense").toLowerCase(),
      };
    }).filter(t => t.amount > 0);
  };

  const parseJSON = (text) => {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error("JSON must be an array");
    return arr.map(o => ({
      date:        o.date || new Date().toISOString().slice(0, 10),
      description: o.description || o.desc || "Imported",
      category:    o.category || "Food",
      amount:      parseFloat(o.amount || 0),
      type:        (o.type || "expense").toLowerCase(),
    })).filter(t => t.amount > 0);
  };

  const processFile = (file) => {
    setError(""); setPreview(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        let parsed;
        if (file.name.endsWith(".json")) parsed = parseJSON(text);
        else if (file.name.endsWith(".csv")) parsed = parseCSV(text);
        else throw new Error("Only .csv or .json files are supported");
        if (!parsed.length) throw new Error("No valid transactions found");
        fullRef.current = parsed;
        setPreview(parsed.slice(0, 4));
      } catch (err) { setError(err.message); }
    };
    reader.readAsText(file);
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white dark:bg-wv-card border border-gray-200 dark:border-wv-border
        rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">

        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-wv-primary">Import Transactions</h3>
            <p className="text-xs text-gray-500 dark:text-wv-secondary mt-0.5">Upload CSV or JSON to bulk import</p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-wv-hover text-gray-500 dark:text-wv-secondary hover:bg-gray-200 dark:hover:bg-wv-border transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all mb-4
            ${drag ? "border-wv-green bg-wv-green/5" : "border-gray-200 dark:border-wv-border bg-gray-50 dark:bg-wv-base hover:border-wv-green/50"}`}>
          <input ref={fileRef} type="file" accept=".csv,.json" onChange={e => { const f = e.target.files[0]; if (f) processFile(f); }} className="hidden" />
          <div className="flex justify-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-wv-green/10"><Table2 size={19} className="text-wv-green" /></div>
            <div className="p-2.5 rounded-xl bg-wv-blue/10"><FileJson size={19} className="text-wv-blue" /></div>
          </div>
          <p className="font-semibold text-sm text-gray-800 dark:text-wv-primary mb-1">
            {drag ? "Drop your file here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-gray-500 dark:text-wv-secondary">Supports <strong>CSV</strong> and <strong>JSON</strong></p>
        </div>

        {/* Format hint */}
        <div className="bg-gray-50 dark:bg-wv-base rounded-xl p-3 mb-4 text-xs text-gray-500 dark:text-wv-secondary">
          <span className="font-bold text-gray-800 dark:text-wv-primary block mb-1">Required columns:</span>
          <code className="text-wv-green">date, description, category, amount, type</code>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-wv-red/10 border border-wv-red/20 text-wv-red text-xs mb-4">
            <AlertCircle size={14} />{error}
          </div>
        )}

        {preview && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-wv-secondary uppercase tracking-wider mb-2">
              Preview · {fullRef.current?.length} rows
            </p>
            <div className="border border-gray-200 dark:border-wv-border rounded-xl overflow-hidden">
              {preview.map((t, i) => (
                <div key={i} className={`grid grid-cols-[1fr_auto] px-3 py-2 gap-2 items-center text-sm
                  ${i < preview.length - 1 ? "border-b border-gray-100 dark:border-wv-border" : ""}
                  ${i % 2 ? "bg-gray-50/50 dark:bg-white/[.02]" : ""}`}>
                  <span className="text-gray-800 dark:text-wv-primary truncate">{t.description}</span>
                  <span className={`font-bold text-xs ${t.type === "income" ? "text-wv-green" : "text-wv-red"}`}>
                    {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-wv-border bg-transparent
              text-gray-500 dark:text-wv-secondary font-semibold text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-wv-hover transition-colors">
            Cancel
          </button>
          <button
            disabled={!preview}
            onClick={() => { if (fullRef.current) { onImport(fullRef.current); onClose(); } }}
            className={`flex-1 py-2.5 rounded-xl border-none font-bold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all
              ${preview
                ? "bg-gradient-to-br from-wv-green to-wv-green-dark text-white shadow-lg shadow-wv-green/25"
                : "bg-gray-100 dark:bg-wv-hover text-gray-400 dark:text-wv-secondary cursor-not-allowed"}`}>
            <Upload size={14} />Import All
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}