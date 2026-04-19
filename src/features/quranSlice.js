import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllSurah,
  fetchDetailSurah,
  searchVectorQuran,
} from "../services/quranApi";

// ============ ASYNC THUNK ============

// 1. Ambil semua surah
export const getAllSurah = createAsyncThunk("quran/getAllSurah", async () => {
  const response = await fetchAllSurah();
  return response.data.data;
});

// 2. Ambil detail surat berdasarkan nomor
export const getSurahDetail = createAsyncThunk(
  "quran/getDetail",
  async (nomor) => {
    const response = await fetchDetailSurah(nomor);
    return response.data.data;
  },
);

// 3. Ambil Tafsir surat
export const getSurahTafsir = createAsyncThunk(
  "quran/getTafsir",
  async (nomor) => {
    const response = await fetch(`https://equran.id/api/v2/tafsir/${nomor}`);
    const resData = await response.json();
    return resData.data;
  },
);

// =============================================
// 4. BARU: Vector Search - Pencarian Semantik AI
// =============================================
export const vectorSearch = createAsyncThunk(
  "quran/vectorSearch",
  async (params, { rejectWithValue }) => {
    try {
      const data = await searchVectorQuran(params);
      return data; // { status, cari, jumlah, hasil: [...] }
    } catch (error) {
      const message =
        error.response?.status === 429
          ? "Terlalu banyak request. Tunggu beberapa saat lagi."
          : "Gagal melakukan pencarian. Silakan coba lagi.";
      return rejectWithValue(message);
    }
  },
);

// ============ INITIAL STATE ============
const initialState = {
  // Data Surah
  surahList: [],
  detailSurah: null,
  tafsirData: null,
  loading: false,
  error: null,

  // Search biasa (filter surah)
  searchTerm: "",

  // =============================================
  // BARU: State untuk Vector Search
  // =============================================
  vectorSearchResults: null,  // { status, cari, jumlah, hasil: [...] }
  vectorSearchLoading: false,  // loading khusus vector search
  vectorSearchError: null,     // error khusus vector search
  vectorSearchQuery: "",       // query terakhir yang dicari

  // Filter tipe untuk vector search
  vectorFilterTypes: [],       // ["ayat", "tafsir", "surat", "doa"]
  vectorActiveTab: "semua",    // tab aktif: "semua", "ayat", "tafsir", "surat", "doa"

  // State lama
  favoriteAyats: JSON.parse(localStorage.getItem("quran_fav_ayats")) || [],
  lastRead: JSON.parse(localStorage.getItem("quran_last_read")) || null,
  audioSettings: {
    isPlaying: false,
    currentQari: "05",
    activeAyatKey: null,
    currentAudioUrl: null,
    isFullSurahMode: false,
  },
  availableQaris: [
    { id: "01", name: "Abdullah Al-Juhany" },
    { id: "02", name: "Abdul Muhsin Al-Qasim" },
    { id: "03", name: "Abdurrahman as-Sudais" },
    { id: "04", name: "Ibrahim Al-Dossari" },
    { id: "05", name: "Misyari Rasyid Al-Afasy" },
  ],
};

const quranSlice = createSlice({
  name: "quran",
  initialState,
  reducers: {
    // Search biasa (filter nama surah)
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    // =============================================
    // BARU: Reducers untuk Vector Search
    // =============================================

    // Set query untuk vector search (tanpa langsung memanggil API)
    setVectorSearchQuery: (state, action) => {
      state.vectorSearchQuery = action.payload;
    },

    // Set tab/filter aktif untuk vector search
    setVectorActiveTab: (state, action) => {
      state.vectorActiveTab = action.payload;

      // Konversi tab ke array tipe untuk API
      if (action.payload === "semua") {
        state.vectorFilterTypes = [];
      } else {
        state.vectorFilterTypes = [action.payload];
      }

      // Reset hasil saat ganti tab
      state.vectorSearchResults = null;
      state.vectorSearchError = null;
    },

    // Reset semua state vector search
    resetVectorSearch: (state) => {
      state.vectorSearchResults = null;
      state.vectorSearchLoading = false;
      state.vectorSearchError = null;
      state.vectorSearchQuery = "";
      state.vectorActiveTab = "semua";
      state.vectorFilterTypes = [];
    },

    // State lama
    toggleFavoriteAyat: (state, action) => {
      const { surahName, ayat } = action.payload;
      const favId = `${surahName}-${ayat.nomorAyat}`;
      const index = state.favoriteAyats.findIndex((f) => f.favId === favId);
      if (index >= 0) {
        state.favoriteAyats.splice(index, 1);
      } else {
        state.favoriteAyats.push({ ...ayat, surahName, favId });
      }
      localStorage.setItem(
        "quran_fav_ayats",
        JSON.stringify(state.favoriteAyats),
      );
    },
    setLastRead: (state, action) => {
      state.lastRead = action.payload;
      localStorage.setItem("quran_last_read", JSON.stringify(action.payload));
    },
    setQari: (state, action) => {
      state.audioSettings.currentQari = action.payload;
    },
    togglePlay: (state) => {
      state.audioSettings.isPlaying = !state.audioSettings.isPlaying;
    },
  },
  extraReducers: (builder) => {
    // --- getAllSurah ---
    builder.addCase(getAllSurah.fulfilled, (state, action) => {
      state.surahList = action.payload;
    });

    // --- getSurahDetail ---
    builder
      .addCase(getSurahDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSurahDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detailSurah = action.payload;
      })
      .addCase(getSurahDetail.rejected, (state) => {
        state.loading = false;
      });

    // --- getSurahTafsir ---
    builder.addCase(getSurahTafsir.fulfilled, (state, action) => {
      state.tafsirData = action.payload;
    });

    // =============================================
    // BARU: Vector Search extraReducers
    // =============================================
    builder
      .addCase(vectorSearch.pending, (state) => {
        state.vectorSearchLoading = true;
        state.vectorSearchError = null;
      })
      .addCase(vectorSearch.fulfilled, (state, action) => {
        state.vectorSearchLoading = false;
        state.vectorSearchResults = action.payload;
      })
      .addCase(vectorSearch.rejected, (state, action) => {
        state.vectorSearchLoading = false;
        state.vectorSearchError = action.payload || "Terjadi kesalahan";
      });
  },
});

export const {
  setSearchTerm,
  setVectorSearchQuery,
  setVectorActiveTab,
  resetVectorSearch,
  toggleFavoriteAyat,
  setLastRead,
  setQari,
  togglePlay,
} = quranSlice.actions;
export default quranSlice.reducer;
