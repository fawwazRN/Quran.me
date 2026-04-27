import React, { useState } from "react";

const Waris = () => {
  const [harta, setHarta] = useState(0);
  const [ahliWaris, setAhliWaris] = useState({
    // Kelompok Dzawil Furudh (Penerima Bagian Tetap) & Ashabah
    suami: false,
    istri: false,
    anakLK: 0,
    anakPR: 0,
    cucuLK: 0, // Anak dari anak laki-laki yang telah meninggal
    cucuPR: 0,
    ayah: false,
    ibu: false,
    kakek: false, // Ayahnya ayah (jika ayah tiada)
    nenek: false, // Ibu dari ayah/ibu (jika ibu tiada)

    // Saudara (Ashabah / Pengganti)
    sdraKandungLK: 0,
    sdraKandungPR: 0,
    sdraAyahLK: 0, // Saudara seayah
    sdraAyahPR: 0,
    sdraIbu: 0, // Saudara seibu (kandung atau seayah, tapi ibu sama)
  });

  const [hasil, setHasil] = useState(null);

  // Helper untuk menghitung bagian
  const hitungWaris = () => {
    let nominal = parseFloat(harta) || 0;
    let bagianPokok = []; // Menyimpan bagian pecahan (e.g., 1/8, 1/6)
    let ashabahCandidates = []; // Calon penerima sisa
    let terhalang = []; // Daftar ahli waris yang terhalang (Hijab)

    // Aliasing variabel untuk kemudahan
    const w = ahliWaris;

    // === 1. IDENTIFIKASI KONDISI AHLI WARIS & PENGHALANG (HIJAB) ===

    // Kondisi Keturunan
    const adaAnakLK = w.anakLK > 0;
    const adaAnakPR = w.anakPR > 0;
    const adaAnak = adaAnakLK || adaAnakPR;

    // Cucu terhalang oleh Anak Laki-laki
    const adaCucuLK = !adaAnakLK && w.cucuLK > 0;
    const adaCucuPR = !adaAnakLK && w.cucuPR > 0;
    const adaCucu = adaCucuLK || adaCucuPR;

    // Orang Tua & Kakek/Nenek
    const adaAyah = w.ayah;
    const adaIbu = w.ibu;
    // Kakek terhalang oleh Ayah
    const adaKakek = !adaAyah && w.kakek;
    // Nenek terhalang oleh Ibu
    const adaNenek = !adaIbu && w.nenek;

    // Saudara
    // Saudara kandung terhalang oleh: Anak LK, Cucu LK, Ayah, Kakek
    const isSdrKandungHijab = adaAnakLK || adaCucuLK || adaAyah || adaKakek;
    // Saudara seayah terhalang oleh: Saudara Kandung LK, plus penghalang di atas
    const isSdrAyahHijab = isSdrKandungHijab || w.sdraKandungLK > 0;
    // Saudara seibu terhalang oleh: Anak (LK/PR), Cucu (LK/PR), Ayah, Kakek
    const isSdrIbuHijab = adaAnak || adaCucu || adaAyah || adaKakek;

    // Simpan info terhalang untuk ditampilkan
    if (w.cucuLK > 0 && adaAnakLK)
      terhalang.push("Cucu Laki-laki (terhalang Anak Laki-laki)");
    if (w.cucuPR > 0 && adaAnakLK)
      terhalang.push("Cucu Perempuan (terhalang Anak Laki-laki)");
    if (w.kakek && adaAyah) terhalang.push("Kakek (terhalang Ayah)");
    if (w.nenek && adaIbu) terhalang.push("Nenek (terhalang Ibu)");
    if ((w.sdraKandungLK > 0 || w.sdraKandungPR > 0) && isSdrKandungHijab)
      terhalang.push("Saudara Kandung (terhalang Anak/Ayah/Kakek)");
    if ((w.sdraAyahLK > 0 || w.sdraAyahPR > 0) && isSdrAyahHijab)
      terhalang.push("Saudara Seayah (terhalang Saudara Kandung/Anak/Ayah)");
    if (w.sdraIbu > 0 && isSdrIbuHijab)
      terhalang.push("Saudara Seibu (terhalang Keturunan/Ayah/Kakek)");

    // === 2. PERHITUNGAN BAGIAN FURUDH (TETAP) ===

    // --- Suami & Istri ---
    // Suami: 1/2 (jika tidak ada anak/cucu), 1/4 (jika ada anak/cucu)
    if (w.suami) {
      const bagian = adaAnak || adaCucu ? 1 / 4 : 1 / 2;
      bagianPokok.push({ pihak: "Suami", pecahan: bagian });
    }
    // Istri: 1/4 (jika tidak ada anak/cucu), 1/8 (jika ada anak/cucu)
    // Jika ada lebih dari 1 istri, mereka berbagi bagian ini
    else if (w.istri) {
      const bagian = adaAnak || adaCucu ? 1 / 8 : 1 / 4;
      bagianPokok.push({ pihak: "Istri", pecahan: bagian });
    }

    // --- Ibu ---
    // Ibu: 1/6 (jika ada anak/cucu), 1/3 (jika tidak ada anak/cucu & bukan umariyyatain)
    // Catatan: Kasus Umariyyatain (Ibu mengambil 1/3 sisa) tidak diimplementasikan demi kesederhanaan
    if (adaIbu) {
      const bagian = adaAnak || adaCucu ? 1 / 6 : 1 / 3;
      bagianPokok.push({ pihak: "Ibu", pecahan: bagian });
    }

    // --- Nenek ---
    // Nenek: 1/6 (menggantikan Ibu)
    if (adaNenek) {
      bagianPokok.push({ pihak: "Nenek", pecahan: 1 / 6 });
    }

    // --- Ayah ---
    // Ayah: 1/6 jika ada anak/cucu. Jika tidak ada, ia Ashabah.
    if (adaAyah) {
      if (adaAnakLK || adaCucuLK) {
        // Ayah mendapat 1/6 saja, tidak ada sisa (karena anak laki2 ashabah)
        bagianPokok.push({ pihak: "Ayah", pecahan: 1 / 6 });
      } else if (adaAnakPR || adaCucuPR) {
        // Ayah mendapat 1/6 + Sisa (Ashabah)
        bagianPokok.push({ pihak: "Ayah (Bagian)", pecahan: 1 / 6 });
        ashabahCandidates.push({ pihak: "Ayah (Sisa)", bobot: 1 }); // Bobot 1
      } else {
        // Ayah Ashabah murni (ambil semua)
        ashabahCandidates.push({ pihak: "Ayah", bobot: 1 });
      }
    }

    // --- Kakek (Pengganti Ayah) ---
    if (adaKakek) {
      // Logika sama seperti Ayah
      if (adaAnakLK || adaCucuLK) {
        bagianPokok.push({ pihak: "Kakek", pecahan: 1 / 6 });
      } else if (adaAnakPR || adaCucuPR) {
        bagianPokok.push({ pihak: "Kakek (Bagian)", pecahan: 1 / 6 });
        ashabahCandidates.push({ pihak: "Kakek (Sisa)", bobot: 1 });
      } else {
        ashabahCandidates.push({ pihak: "Kakek", bobot: 1 });
      }
    }

    // --- Anak Perempuan ---
    // 1/2 (sendiri), 2/3 (berdua atau lebih). Jika ada Anak LK, ia menjadi Ashabah.
    if (adaAnakPR) {
      if (adaAnakLK) {
        // Menjadi Ashabah bersama Anak LK (dibahas di bawah)
      } else {
        const bagian = w.anakPR >= 2 ? 2 / 3 : 1 / 2;
        bagianPokok.push({
          pihak: `Anak Perempuan (${w.anakPR})`,
          pecahan: bagian,
        });
      }
    }

    // --- Cucu Perempuan ---
    // 1/2, 2/3 (jika tidak ada anak). Terhalang oleh Anak LK.
    if (adaCucuPR) {
      if (adaAnakLK) {
        // Terhalang
      } else if (adaAnakPR) {
        // Jika ada 1 anak pr, cucu pr mendapat 1/6 (pelit 2/3 - 1/2)
        if (w.anakPR === 1) {
          bagianPokok.push({
            pihak: `Cucu Perempuan (${w.cucuPR})`,
            pecahan: 1 / 6,
          });
        }
        // Jika anak pr >= 2, cucu pr terhalang
      } else {
        // Tidak ada anak
        const bagian = w.cucuPR >= 2 ? 2 / 3 : 1 / 2;
        bagianPokok.push({
          pihak: `Cucu Perempuan (${w.cucuPR})`,
          pecahan: bagian,
        });
      }
    }

    // --- Saudara Seibu ---
    // 1/6 (lk/pr sendiri), 1/3 (berdua atau lebih). Laki/Pr sama rata.
    if (w.sdraIbu > 0 && !isSdrIbuHijab) {
      const bagian = w.sdraIbu >= 2 ? 1 / 3 : 1 / 6;
      bagianPokok.push({
        pihak: `Saudara Seibu (${w.sdraIbu})`,
        pecahan: bagian,
      });
    }

    // --- Saudara Kandung & Seayah (Bagian Tetap jika tidak ada Ashabah Laki2) ---
    // Perempuan: 1/2 (sendiri), 2/3 (berjamaah). Hanya jika tidak ada saudara laki2.
    // Jika ada saudara laki2, masuk Ashabah.

    // === 3. PERHITUNGAN ASHABAH (PENGAMBIL SISA) ===

    // Prioritas Ashabah:
    // 1. Anak Laki-laki (dengan Anak Perempuan)
    // 2. Cucu Laki-laki (dengan Cucu Perempuan)
    // 3. Saudara Kandung Laki-laki (dengan Saudara PR)
    // 4. Saudara Seayah Laki-laki (dengan Saudara Seayah PR)

    // Anak Laki-laki & Anak Perempuan (Ashabah Ma'a Ghairihi)
    if (adaAnakLK) {
      const totalKepala = w.anakLK * 2 + w.anakPR * 1;
      // Masukkan ke kandidat Ashabah
      ashabahCandidates.push({
        pihak: "Anak Laki-laki & Perempuan",
        bobot: totalKepala,
        detail: { lk: w.anakLK, pr: w.anakPR },
      });
    }
    // Cucu Laki-laki & Cucu Perempuan
    else if (adaCucuLK) {
      const totalKepala = w.cucuLK * 2 + w.cucuPR * 1;
      ashabahCandidates.push({
        pihak: "Cucu Laki-laki & Perempuan",
        bobot: totalKepala,
        detail: { lk: w.cucuLK, pr: w.cucuPR, type: "cucu" },
      });
    }
    // Saudara Kandung (Jika tidak ada keturunan & ayah/kakek)
    else if (
      (w.sdraKandungLK > 0 || w.sdraKandungPR > 0) &&
      !isSdrKandungHijab
    ) {
      if (w.sdraKandungLK > 0) {
        const totalKepala = w.sdraKandungLK * 2 + w.sdraKandungPR * 1;
        ashabahCandidates.push({
          pihak: "Saudara Kandung",
          bobot: totalKepala,
          detail: { lk: w.sdraKandungLK, pr: w.sdraKandungPR, type: "kandung" },
        });
      } else {
        // Hanya Saudara Perempuan, tidak ada LK -> Furudh
        const bagian = w.sdraKandungPR >= 2 ? 2 / 3 : 1 / 2;
        bagianPokok.push({
          pihak: `Saudara Kandung PR (${w.sdraKandungPR})`,
          pecahan: bagian,
        });
      }
    }
    // Saudara Seayah (Jika tidak ada saudara kandung laki2 & penghalang lain)
    else if ((w.sdraAyahLK > 0 || w.sdraAyahPR > 0) && !isSdrAyahHijab) {
      if (w.sdraAyahLK > 0) {
        const totalKepala = w.sdraAyahLK * 2 + w.sdraAyahPR * 1;
        ashabahCandidates.push({
          pihak: "Saudara Seayah",
          bobot: totalKepala,
          detail: { lk: w.sdraAyahLK, pr: w.sdraAyahPR, type: "seayah" },
        });
      } else {
        const bagian = w.sdraAyahPR >= 2 ? 2 / 3 : 1 / 2;
        bagianPokok.push({
          pihak: `Saudara Seayah PR (${w.sdraAyahPR})`,
          pecahan: bagian,
        });
      }
    }

    // === 4. KALKULASI FINAL (AUL & RADD) ===

    let totalBagianTetap = bagianPokok.reduce(
      (sum, item) => sum + item.pecahan,
      0,
    );
    let rincian = [];

    // Skenario Aul (Total bagian > 1)
    // Misal: Suami (1/4) + 2 Anak PR (2/3) + Ibu (1/6). Total = 15/12 > 1.
    // Solusi: Kalikan harta dengan (Bagian / TotalBagian).
    if (totalBagianTetap > 1) {
      // Kondisi Aul
      bagianPokok.forEach((item) => {
        const jumlah = (item.pecahan / totalBagianTetap) * nominal;
        rincian.push({
          pihak: item.pihak,
          jumlah: jumlah,
          keterangan: `Asal ${fractionToText(item.pecahan)} (Aul)`,
        });
      });
      // Dalam Aul, Ashabah tidak mendapat sisa (sisa = 0)
    }
    // Skenario Normal atau Radd (Total bagian <= 1)
    else {
      // Bagikan Bagian Tetap
      bagianPokok.forEach((item) => {
        const jumlah = item.pecahan * nominal;
        rincian.push({
          pihak: item.pihak,
          jumlah: jumlah,
          keterangan: fractionToText(item.pecahan),
        });
      });

      // Hitung Sisa untuk Ashabah
      let terpakai = rincian.reduce((sum, item) => sum + item.jumlah, 0);
      let sisa = nominal - terpakai;

      if (ashabahCandidates.length > 0 && sisa > 0) {
        // Proses Ashabah (mengambil sisa)
        const candidate = ashabahCandidates[0]; // Prioritas pertama yang menang

        // Jika detail ada (berarti campuran LK/PR)
        if (candidate.detail) {
          const nilaiPerBobot = sisa / candidate.bobot;
          if (candidate.detail.lk > 0) {
            rincian.push({
              pihak: `${candidate.detail.lk} Anak Laki-laki`,
              jumlah: nilaiPerBobot * 2 * candidate.detail.lk,
              keterangan: "Ashabah (2x bagian)",
            });
          }
          if (candidate.detail.pr > 0) {
            rincian.push({
              pihak: `${candidate.detail.pr} Anak Perempuan`,
              jumlah: nilaiPerBobot * 1 * candidate.detail.pr,
              keterangan: "Ashabah (1x bagian)",
            });
          }
        } else {
          // Ashabah murni (misal Ayah sendirian)
          rincian.push({
            pihak: candidate.pihak,
            jumlah: sisa,
            keterangan: "Ashabah",
          });
        }
        terpakai += sisa;
        sisa = 0;
      }

      // Jika masih ada sisa dan tidak ada Ashabah -> Radd (dikembalikan) atau Baitul Maal
      // Untuk kesederhanaan, kita kembalikan proporsional ke ahli waris furudh (kecuali suami/istri) atau sebut Baitul Maal
      if (sisa > 0.01) {
        // Logika Radd sederhana: Kembalikan ke selain Suami/Istri
        const penerimaRadd = bagianPokok.filter(
          (b) => b.pihak !== "Suami" && b.pihak !== "Istri",
        );

        if (penerimaRadd.length > 0) {
          const totalRadd = penerimaRadd.reduce((s, i) => s + i.pecahan, 0);
          penerimaRadd.forEach((item) => {
            const tambahan = (item.pecahan / totalRadd) * sisa;
            // Update rincian yang sudah ada
            const idx = rincian.findIndex((r) => r.pihak === item.pihak);
            if (idx >= 0) rincian[idx].jumlah += tambahan;
          });
          rincian.push({
            pihak: "Keterangan",
            jumlah: 0,
            keterangan: `Sisa harta (Radd) dikembalikan kepada ahli waris`,
          });
        } else {
          rincian.push({
            pihak: "Baitul Maal / Ahli Waris Lain",
            jumlah: sisa,
            keterangan: "Sisa Harta",
          });
        }
      }
    }

    // Filter hasil negatif atau nol
    const finalRincian = rincian.filter(
      (r) => r.jumlah > 0 || r.pihak.includes("Keterangan"),
    );

    setHasil({ rincian: finalRincian, terhalang });
  };

  // Helper Ubah Pecahan ke Teks
  const fractionToText = (frac) => {
    if (frac === 0.5) return "1/2";
    if (frac === 0.25) return "1/4";
    if (frac === 0.125) return "1/8";
    if (frac === 1 / 6) return "1/6";
    if (frac === 1 / 3) return "1/3";
    if (frac === 2 / 3) return "2/3";
    return frac.toFixed(3);
  };

  const formatRp = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleNumberChange = (key, value) => {
    setAhliWaris({ ...ahliWaris, [key]: parseInt(value) || 0 });
  };

  const handleCheckChange = (key, checked) => {
    setAhliWaris({ ...ahliWaris, [key]: checked });
  };

  return (
    <div className="bg-gray-50 mx-auto p-4 md:p-8 max-w-4xl min-h-screen">
      <div className="bg-white shadow-xl p-6 rounded-2xl">
        <h1 className="mb-2 font-bold text-emerald-700 text-2xl md:text-3xl text-center">
          Kalkulator Waris Faraidh
        </h1>
        <p className="mb-6 text-gray-500 text-sm text-center">
          Perhitungan berdasarkan syariat Islam (Al-Quran & Sunnah) dengan
          penanganan Hijab, Ashabah, dan Aul.
        </p>

        <section className="mb-6">
          <label className="block mb-2 font-semibold text-lg">
            Total Harta Waris (Rupiah)
          </label>
          <input
            type="number"
            className="p-3 border-2 border-emerald-100 focus:border-emerald-500 rounded-lg outline-none w-full text-lg transition"
            placeholder="Contoh: 100000000"
            onChange={(e) => setHarta(e.target.value)}
          />
        </section>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {/* Kolom 1: Keluarga Inti */}
          <div className="space-y-3 bg-gray-50 p-4 border rounded-xl">
            <h3 className="mb-2 pb-2 border-b font-bold text-gray-800">
              Keluarga Inti & Keturunan
            </h3>

            {/* Pasangan */}
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  onChange={(e) => handleCheckChange("suami", e.target.checked)}
                />{" "}
                Suami
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  onChange={(e) => handleCheckChange("istri", e.target.checked)}
                />{" "}
                Istri
              </label>
            </div>

            {/* Orang Tua */}
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  onChange={(e) => handleCheckChange("ayah", e.target.checked)}
                />{" "}
                Ayah
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  onChange={(e) => handleCheckChange("ibu", e.target.checked)}
                />{" "}
                Ibu
              </label>
            </div>

            {/* Anak */}
            <div className="gap-2 grid grid-cols-2">
              <div>
                <label className="block text-gray-500 text-xs">
                  Anak Laki-laki
                </label>
                <input
                  type="number"
                  min="0"
                  className="p-2 border rounded w-full text-sm"
                  onChange={(e) => handleNumberChange("anakLK", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs">
                  Anak Perempuan
                </label>
                <input
                  type="number"
                  min="0"
                  className="p-2 border rounded w-full text-sm"
                  onChange={(e) => handleNumberChange("anakPR", e.target.value)}
                />
              </div>
            </div>

            {/* Cucu */}
            <div className="gap-2 grid grid-cols-2 pt-2 border-t">
              <div>
                <label className="block text-gray-500 text-xs">
                  Cucu Laki-laki
                </label>
                <input
                  type="number"
                  min="0"
                  className="p-2 border rounded w-full text-sm"
                  onChange={(e) => handleNumberChange("cucuLK", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-xs">
                  Cucu Perempuan
                </label>
                <input
                  type="number"
                  min="0"
                  className="p-2 border rounded w-full text-sm"
                  onChange={(e) => handleNumberChange("cucuPR", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Kolom 2: Pengganti & Saudara */}
          <div className="space-y-3 bg-gray-50 p-4 border rounded-xl">
            <h3 className="mb-2 pb-2 border-b font-bold text-gray-800">
              Pengganti & Saudara
            </h3>

            {/* Pengganti Orang Tua */}
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  onChange={(e) => handleCheckChange("kakek", e.target.checked)}
                />{" "}
                Kakek (Ayahnya Ayah)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  onChange={(e) => handleCheckChange("nenek", e.target.checked)}
                />{" "}
                Nenek
              </label>
            </div>

            {/* Saudara Kandung */}
            <div className="pt-2 border-t">
              <span className="block mb-2 font-semibold text-gray-500 text-xs">
                Saudara Kandung
              </span>
              <div className="gap-2 grid grid-cols-2">
                <div>
                  <label className="block text-gray-400 text-xs">
                    Laki-laki
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="p-2 border rounded w-full text-sm"
                    onChange={(e) =>
                      handleNumberChange("sdraKandungLK", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs">
                    Perempuan
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="p-2 border rounded w-full text-sm"
                    onChange={(e) =>
                      handleNumberChange("sdraKandungPR", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Saudara Seayah */}
            <div className="pt-2 border-t">
              <span className="block mb-2 font-semibold text-gray-500 text-xs">
                Saudara Seayah
              </span>
              <div className="gap-2 grid grid-cols-2">
                <div>
                  <label className="block text-gray-400 text-xs">
                    Laki-laki
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="p-2 border rounded w-full text-sm"
                    onChange={(e) =>
                      handleNumberChange("sdraAyahLK", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs">
                    Perempuan
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="p-2 border rounded w-full text-sm"
                    onChange={(e) =>
                      handleNumberChange("sdraAyahPR", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Saudara Seibu */}
            <div className="pt-2 border-t">
              <span className="block mb-2 font-semibold text-gray-500 text-xs">
                Saudara Seibu (lain ayah)
              </span>
              <div>
                <label className="block text-gray-400 text-xs">
                  Jumlah Saudara Seibu
                </label>
                <input
                  type="number"
                  min="0"
                  className="p-2 border rounded w-full text-sm"
                  onChange={(e) =>
                    handleNumberChange("sdraIbu", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={hitungWaris}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg mt-6 py-3 rounded-lg w-full font-bold text-white text-lg transition">
          HITUNG WARIS
        </button>

        {hasil && (
          <div className="space-y-4 mt-6">
            {/* Notifikasi Terhalang */}
            {hasil.terhalang.length > 0 && (
              <div className="bg-yellow-50 p-4 border-yellow-400 border-l-4 rounded-r-lg">
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current mr-4 w-6 h-6 text-yellow-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM12.73 9.93l.52-3.34H9.98l-.52 3.34h3.27zm-1.04 6.66l.52-3.34H9.98l-.52 3.34h3.27z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-yellow-700">
                      Ada Ahli Waris yang Terhalang (Hijab)
                    </p>
                    <ul className="mt-1 text-yellow-600 text-sm list-disc list-inside">
                      {hasil.terhalang.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Hasil Utama */}
            <div className="bg-emerald-50 p-6 border border-emerald-200 rounded-xl">
              <h2 className="mb-4 pb-2 border-b font-bold text-emerald-800 text-xl">
                Rincian Pembagian Harta
              </h2>
              <div className="space-y-3">
                {hasil.rincian.map((h, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center bg-white shadow-sm p-3 rounded-lg border ${h.pihak.includes("Keterangan") ? "border-dashed border-gray-300 bg-gray-50 italic text-gray-600 text-sm" : "border-gray-100"}`}>
                    <div>
                      <span className="block font-semibold text-gray-800">
                        {h.pihak}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {h.keterangan}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600 text-right">
                      {h.jumlah > 0 ? formatRp(h.jumlah) : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-gray-400 text-xs text-center">
          *Perhitungan ini mengikuti kaidah Faraidh umum. Konsultasikan hasilnya
          kepada ulama atau ahli waris lokal untuk kasus khusus.
        </p>
      </div>
    </div>
  );
};

export default Waris;
