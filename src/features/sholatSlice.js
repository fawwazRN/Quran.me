import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSemuaProvinsi,
  fetchKabKota,
  fetchJadwalSholatHarian,
} from "../services/sholatApi";

// ============ ASYNC THUNKS ============

// 1. Ambil daftar semua provinsi
export const getSemuaProvinsi = createAsyncThunk(
  "sholat/getSemuaProvinsi",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchSemuaProvinsi();
      return data; // array string: ["Aceh", "Bali", ...]
    } catch (error) {
      return rejectWithValue("Gagal mengambil daftar provinsi");
    }
  },
);

// 2. Ambil daftar kabupaten/kota berdasarkan provinsi
export const getKabKota = createAsyncThunk(
  "sholat/getKabKota",
  async (namaProvinsi, { rejectWithValue }) => {
    try {
      const data = await fetchKabKota(namaProvinsi);
      return data; // array string: ["Kep. Seribu Selatan", ...]
    } catch (error) {
      return rejectWithValue("Gagal mengambil daftar kabupaten/kota");
    }
  },
);

// 3. Ambil jadwal sholat hari ini
export const getJadwalHariIni = createAsyncThunk(
  "sholat/getJadwalHariIni",
  async ({ provinsi, kabkota }, { rejectWithValue }) => {
    try {
      const data = await fetchJadwalSholatHarian(provinsi, kabkota);
      return data; // { provinsi, kabkota, jadwal }
    } catch (error) {
      return rejectWithValue("Gagal mengambil jadwal sholat");
    }
  },
);

// ============ INITIAL STATE ============
const initialState = {
  // Data jadwal
  jadwal: null,       // { provinsi, kabkota, jadwal: { tanggal, subuh, ... } }
  loading: false,
  error: null,

  // Data lokasi (dropdown)
  daftarProvinsi: [], // ["Aceh", "Bali", ...]
  daftarKabKota: [],  // ["Kep. Seribu Selatan", ...]
  loadingLokasi: false,

  // Pilihan user (default: DKI Jakarta)
  selectedProvinsi: "DKI Jakarta",
  selectedKabKota: "Kep. Seribu Selatan",
};

// ============ SLICE ============
const sholatSlice = createSlice({
  name: "sholat",
  initialState,
  reducers: {
    setProvinsi: (state, action) => {
      state.selectedProvinsi = action.payload;
      // Reset kabkota ketika provinsi berubah
      state.selectedKabKota = "";
      state.daftarKabKota = [];
    },
    setKabKota: (state, action) => {
      state.selectedKabKota = action.payload;
    },
  },
  extraReducers: (builder) => {
    // --- getSemuaProvinsi ---
    builder
      .addCase(getSemuaProvinsi.pending, (state) => {
        state.loadingLokasi = true;
      })
      .addCase(getSemuaProvinsi.fulfilled, (state, action) => {
        state.loadingLokasi = false;
        state.daftarProvinsi = action.payload;
      })
      .addCase(getSemuaProvinsi.rejected, (state, action) => {
        state.loadingLokasi = false;
        state.error = action.payload;
      });

    // --- getKabKota ---
    builder
      .addCase(getKabKota.pending, (state) => {
        state.loadingLokasi = true;
      })
      .addCase(getKabKota.fulfilled, (state, action) => {
        state.loadingLokasi = false;
        state.daftarKabKota = action.payload;
        // Auto-pilih kabkota pertama
        if (action.payload.length > 0) {
          state.selectedKabKota = action.payload[0];
        }
      })
      .addCase(getKabKota.rejected, (state, action) => {
        state.loadingLokasi = false;
        state.error = action.payload;
      });

    // --- getJadwalHariIni ---
    builder
      .addCase(getJadwalHariIni.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJadwalHariIni.fulfilled, (state, action) => {
        state.loading = false;
        state.jadwal = action.payload;
      })
      .addCase(getJadwalHariIni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      });
  },
});

export const { setProvinsi, setKabKota } = sholatSlice.actions;
export default sholatSlice.reducer;
