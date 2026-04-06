import { createSlice } from "@reduxjs/toolkit";

const INITIAL_TRANSACTIONS = [
  { id:  1, date: "2025-03-01", description: "Monthly Salary",           category: "Salary",     amount: 15500, type: "income"  },
  { id:  2, date: "2025-03-02", description: "House Rent – March",       category: "Rent",       amount: 2000,  type: "expense" },
  { id:  3, date: "2025-03-04", description: "Reliance Fresh",           category: "Groceries",  amount: 320,   type: "expense" },
  { id:  4, date: "2025-03-05", description: "Swiggy Dinner",            category: "Food",       amount: 180,   type: "expense" },
  { id:  5, date: "2025-03-06", description: "MSEB Electricity Bill",    category: "Utilities",  amount: 850,   type: "expense" },
  { id:  6, date: "2025-03-08", description: "Ola Cab – Office",         category: "Transport",  amount: 220,   type: "expense" },
  { id:  7, date: "2025-03-09", description: "Freelance Design Project", category: "Freelance",  amount: 4500,  type: "income"  },
  { id:  8, date: "2025-03-10", description: "D-Mart Weekly Grocery",    category: "Groceries",  amount: 480,   type: "expense" },
  { id:  9, date: "2025-03-11", description: "Zomato Lunch",             category: "Food",       amount: 145,   type: "expense" },
  { id: 10, date: "2025-03-12", description: "Jio Broadband Plan",       category: "Internet",   amount: 399,   type: "expense" },
  { id: 11, date: "2025-03-13", description: "Chemist – Meds",           category: "Healthcare", amount: 290,   type: "expense" },
  { id: 12, date: "2025-03-14", description: "Rapido Bike Ride",         category: "Transport",  amount: 60,    type: "expense" },
  { id: 13, date: "2025-03-15", description: "Amazon – Headphones",      category: "Shopping",   amount: 1299,  type: "expense" },
  { id: 14, date: "2025-03-16", description: "Blinkit Groceries",        category: "Groceries",  amount: 395,   type: "expense" },
  { id: 15, date: "2025-03-17", description: "Freelance Content Work",   category: "Freelance",  amount: 2000,  type: "income"  },
  { id: 16, date: "2025-03-18", description: "Cafe Coffee Day",          category: "Food",       amount: 350,   type: "expense" },
  { id: 17, date: "2025-03-19", description: "Petrol – Bike",            category: "Transport",  amount: 200,   type: "expense" },
  { id: 18, date: "2025-03-20", description: "Gas Cylinder – Monthly",   category: "Utilities",  amount: 250,   type: "expense" },
  { id: 19, date: "2025-03-22", description: "Flipkart – Clothes",       category: "Shopping",   amount: 850,   type: "expense" },
  { id: 20, date: "2025-03-23", description: "Apollo Pharmacy",          category: "Healthcare", amount: 180,   type: "expense" },
  { id: 21, date: "2025-03-24", description: "Big Basket Fresh",         category: "Groceries",  amount: 570,   type: "expense" },
  { id: 22, date: "2025-03-25", description: "Uber – Airport Drop",      category: "Transport",  amount: 440,   type: "expense" },
  { id: 23, date: "2025-03-26", description: "Domino's Pizza",           category: "Food",       amount: 420,   type: "expense" },
  { id: 24, date: "2025-03-27", description: "Bonus Payout",             category: "Salary",     amount: 3000,  type: "income"  },
  { id: 25, date: "2025-03-28", description: "Water Bill",               category: "Utilities",  amount: 180,   type: "expense" },
  // February data (for month comparison)
  { id: 26, date: "2025-02-01", description: "February Salary",          category: "Salary",     amount: 15500, type: "income"  },
  { id: 27, date: "2025-02-03", description: "House Rent – Feb",         category: "Rent",       amount: 2000,  type: "expense" },
  { id: 28, date: "2025-02-07", description: "Weekly Groceries",         category: "Groceries",  amount: 620,   type: "expense" },
  { id: 29, date: "2025-02-10", description: "Electricity Bill",         category: "Utilities",  amount: 780,   type: "expense" },
  { id: 30, date: "2025-02-14", description: "Valentine's Dinner",       category: "Food",       amount: 680,   type: "expense" },
  { id: 31, date: "2025-02-18", description: "Freelance Feb Project",    category: "Freelance",  amount: 3000,  type: "income"  },
  { id: 32, date: "2025-02-20", description: "Online Shopping",          category: "Shopping",   amount: 1100,  type: "expense" },
  { id: 33, date: "2025-02-22", description: "Transport Weekly",         category: "Transport",  amount: 400,   type: "expense" },
  { id: 34, date: "2025-02-25", description: "Doctor Visit",             category: "Healthcare", amount: 500,   type: "expense" },
];

let nextId = INITIAL_TRANSACTIONS.length + 1;

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: INITIAL_TRANSACTIONS,
    // Filters (kept in Redux so Insights page can reflect same filter state)
    filters: {
      search: "",
      category: "All",
      type: "All",
      sortBy: "newest",
    },
  },
  reducers: {
    addTransaction(state, action) {
      state.list.unshift({ ...action.payload, id: nextId++ });
    },
    updateTransaction(state, action) {
      const idx = state.list.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deleteTransaction(state, action) {
      state.list = state.list.filter(t => t.id !== action.payload);
    },
    importTransactions(state, action) {
      const imported = action.payload.map(t => ({ ...t, id: nextId++ }));
      state.list = [...imported, ...state.list];
    },
    setFilter(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    resetFilters(state) {
      state.filters = { search: "", category: "All", type: "All", sortBy: "newest" };
    },
  },
});

export const {
  addTransaction, updateTransaction, deleteTransaction,
  importTransactions, setFilter, resetFilters,
} = transactionSlice.actions;

// ─── SELECTORS ─────────────────────────────────────────────────────────────────
export const selectAllTransactions = (state) => state.transactions.list;
export const selectFilters         = (state) => state.transactions.filters;

export const selectFilteredTransactions = (state) => {
  const { list, filters } = state.transactions;
  const { search, category, type, sortBy } = filters;
  let r = [...list];
  if (search.trim()) {
    const q = search.toLowerCase();
    r = r.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  if (category !== "All") r = r.filter(t => t.category === category);
  if (type !== "All")     r = r.filter(t => t.type === type.toLowerCase());
  if (sortBy === "newest") r.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sortBy === "oldest") r.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sortBy === "high")   r.sort((a, b) => b.amount - a.amount);
  if (sortBy === "low")    r.sort((a, b) => a.amount - b.amount);
  return r;
};

export const selectFinancials = (state) => {
  const list = state.transactions.list;
  const income  = list.filter(t => t.type === "income" ).reduce((s, t) => s + t.amount, 0);
  const expense = list.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings = income - expense;
  const savingsRate = income > 0 ? +((savings / income) * 100).toFixed(1) : 0;
  return { income, expense, savings, savingsRate };
};

export default transactionSlice.reducer;