import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transactionSlice";
import uiReducer          from "./uiSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    ui:           uiReducer,
  },
});

export default store;