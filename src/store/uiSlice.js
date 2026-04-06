import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    dark:        true,
    role:        "user",         // "user" | "admin"
    activePage:  "dashboard",   // "dashboard" | "transaction" | "insights" | "wealthai"
    sidebarOpen: window.innerWidth >= 900,
    toast:       null,           // { msg, type: "success" | "error" }
  },
  reducers: {
    toggleDark(state)           { state.dark = !state.dark; },
    setDark(state, { payload }) { state.dark = payload; },
    setRole(state, { payload }) { state.role = payload; },
    navigate(state, { payload }){ state.activePage = payload; if (window.innerWidth < 900) state.sidebarOpen = false; },
    toggleSidebar(state)        { state.sidebarOpen = !state.sidebarOpen; },
    setSidebar(state, { payload }){ state.sidebarOpen = payload; },
    showToast(state, { payload }){ state.toast = payload; },  // { msg, type }
    clearToast(state)           { state.toast = null; },
  },
});

export const { toggleDark, setDark, setRole, navigate, toggleSidebar, setSidebar, showToast, clearToast } = uiSlice.actions;

export const selectDark        = (s) => s.ui.dark;
export const selectRole        = (s) => s.ui.role;
export const selectActivePage  = (s) => s.ui.activePage;
export const selectSidebarOpen = (s) => s.ui.sidebarOpen;
export const selectToast       = (s) => s.ui.toast;

export default uiSlice.reducer;