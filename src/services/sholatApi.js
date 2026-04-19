import axios from "axios";

// ============================================
// URL BASE API v2 - EQURAN.ID
// ============================================
// PERHATIAN: API v2 menggunakan POST + nama string (provinsi & kabkota)
// BUKAN lagi GET + angka ID kota
// ============================================
const BASE_URL = "https://equran.id/api/v2/shalat";

// ==============================
// 1. Ambil semua provinsi (GET)
// ==============================
// Response: { code: 200, data: ["Aceh", "Bali", "DKI Jakarta", ...] }
export const fetchSemuaProvinsi = async () => {
  const response = await axios.get(`${BASE_URL}/provinsi`);
  return response.data.data; // langsung return array string
};

// ==============================
// 2. Ambil kabupaten/kota berdasarkan provinsi (POST)
// ==============================
// Body: { "provinsi": "DKI Jakarta" }
// Response: { code: 200, data: ["Kep. Seribu Selatan", "Kep. Seribu Utara", ...] }
export const fetchKabKota = async (namaProvinsi) => {
  const response = await axios.post(`${BASE_URL}/kabkota`, {
    provinsi: namaProvinsi,
  });
  return response.data.data; // langsung return array string
};

// ==============================
// 3. Ambil jadwal sholat BULANAN (POST)
// ==============================
// Body: { "provinsi": "DKI Jakarta", "kabkota": "Kep. Seribu Selatan", "bulan": 4, "tahun": 2026 }
// Response: { code: 200, data: { provinsi, kabkota, jadwal: [...] } }
export const fetchJadwalSholatBulanan = async (
  provinsi,
  kabkota,
  tahun,
  bulan,
) => {
  const response = await axios.post(BASE_URL, {
    provinsi,
    kabkota,
    tahun,
    bulan,
  });
  return response.data.data; // return objek { provinsi, kabkota, jadwal }
};

// ==============================
// 4. Ambil jadwal sholat HARI INI (POST)
// ==============================
// Helper: otomatis pakai tanggal hari ini
export const fetchJadwalSholatHarian = async (provinsi, kabkota) => {
  const date = new Date();
  const tahun = date.getFullYear();
  const bulan = date.getMonth() + 1;
  const tanggal = date.getDate();

  const data = await fetchJadwalSholatBulanan(provinsi, kabkota, tahun, bulan);

  // Cari jadwal hari ini berdasarkan angka tanggal
  const jadwalHariIni = data.jadwal.find((item) => item.tanggal === tanggal);

  return {
    provinsi: data.provinsi,
    kabkota: data.kabkota,
    jadwal: jadwalHariIni,
  };
};
