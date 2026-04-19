import axios from "axios";

const BASE_URL = "https://equran.id/api/v2";
const VECTOR_URL = "https://equran.id/api/vector";

export const fetchAllSurah = () => axios.get(`${BASE_URL}/surat`);
export const fetchDetailSurah = (nomor) =>
  axios.get(`${BASE_URL}/surat/${nomor}`);

// Perbaikan fungsi Vector Search
export const searchVectorQuran = async (params) => {
  // API ini membutuhkan method POST
  const response = await axios.post(VECTOR_URL, {
    cari: params.cari,
    batas: params.batas || 5,
    tipe: params.tipe || ["ayat", "surat", "tafsir", "doa"],
    skorMin: params.skorMin || 0,
  });
  return response.data; // Mengembalikan { status, cari, jumlah, hasil: [...] }
};
