import { configureStore } from "@reduxjs/toolkit";
import quranReducer from "../features/quranSlice";
import sholatReducer from "../features/sholatSlice";
import aiReducer from "../features/aiSlice"; // <-- Import aiSlice

export const store = configureStore({
  reducer: {
    quran: quranReducer,
    sholat: sholatReducer,
    ai: aiReducer, // <-- Tambahkan di sini
  },
});
