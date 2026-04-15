import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllSurah, fetchDetailSurah } from "../services/quranApi";

// ============ ASYNC THUNK ============

export const getAllSurah = createAsyncThunk("quran/getAllSurah", async () => {
  const response = await fetchAllSurah();
  return response.data.data;
});

export const getSurahDetail = createAsyncThunk(
  "quran/getDetail",
  async (nomor) => {
    const response = await fetchDetailSurah(nomor);
    return response.data.data;
  },
);

// ============ INITIAL STATE ============

const initialState = {
  surahList: [],
  detailSurah: null,
  loading: false,
  error: null,
  searchTerm: "",

  // Fitur Favorit & Terakhir Baca
  favoriteAyats: JSON.parse(localStorage.getItem("quran_fav_ayats")) || [],
  lastRead: JSON.parse(localStorage.getItem("quran_last_read")) || null,

  // --- UPGRADE AUDIO SYSTEM ---
  audioSettings: {
    isPlaying: false,
    currentQari: "05", // Default: Al-Afasy (Berdasarkan API id)
    activeAyatKey: null, // format: "nomorSurah:nomorAyat"
    currentAudioUrl: null,
    isFullSurahMode: false,
  },

  // List Qari yang tersedia di API equran.id
  availableQaris: [
    { id: "01", name: "Abdullah Al-Juhany" },
    { id: "02", name: "Abdul Muhsin Al-Qasim" },
    { id: "03", name: "Abdurrahman as-Sudais" },
    { id: "04", name: "Ibrahim Al-Dossari" },
    { id: "05", name: "Misyari Rasyid Al-Afasy" },
  ],
};

// ============ SLICE ============

const quranSlice = createSlice({
  name: "quran",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    // Logika Favorit
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

    // --- NEW AUDIO REDUCERS ---

    // Ganti Qari
    setQari: (state, action) => {
      state.audioSettings.currentQari = action.payload;
      // Jika sedang play, kita harus update URL audio yang sedang diputar
      if (state.audioSettings.activeAyatKey && state.detailSurah) {
        const [_, ayatNum] = state.audioSettings.activeAyatKey.split(":");
        const targetAyat = state.detailSurah.ayat.find(
          (a) => a.nomorAyat === parseInt(ayatNum),
        );
        if (targetAyat) {
          state.audioSettings.currentAudioUrl =
            targetAyat.audio[action.payload];
        }
      }
    },

    // Putar Audio per Ayat
    playAyatAudio: (state, action) => {
      const { surahNo, ayatNo, audioUrl } = action.payload;
      state.audioSettings.activeAyatKey = `${surahNo}:${ayatNo}`;
      state.audioSettings.currentAudioUrl = audioUrl;
      state.audioSettings.isPlaying = true;
      state.audioSettings.isFullSurahMode = false;
    },

    // Toggle Play/Pause
    togglePlay: (state) => {
      state.audioSettings.isPlaying = !state.audioSettings.isPlaying;
    },

    stopAudio: (state) => {
      state.audioSettings.isPlaying = false;
      state.audioSettings.activeAyatKey = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllSurah.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSurah.fulfilled, (state, action) => {
        state.loading = false;
        state.surahList = action.payload;
      })
      .addCase(getSurahDetail.pending, (state) => {
        state.loading = true;
        state.detailSurah = null;
      })
      .addCase(getSurahDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detailSurah = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  toggleFavoriteAyat,
  setLastRead,
  setQari,
  playAyatAudio,
  togglePlay,
  stopAudio,
} = quranSlice.actions;

export default quranSlice.reducer;
