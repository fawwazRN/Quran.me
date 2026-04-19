import { BrowserRouter, Routes, Route } from "react-router-dom";
import Detail from "./pages/Detail";
import Home from "./components/Skeleton";
import ScrollToTop from "./ScrollToTop";
import Footer from "./pages/Footer";
import JadwalSholat from "./pages/JadwalSholat";
import MobileNav from "./MobileNav";
import SidebarNav from "./SidebarNav";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
        {/* SIDEBAR: Tetap di kiri (Desktop) */}
        <SidebarNav />

        {/* MAIN WRAPPER: Memberikan margin kiri selebar sidebar (w-80 = 20rem atau 320px) */}
        <div className="flex flex-col lg:ml-80 min-h-screen">
          {/* AREA KONTEN UTAMA */}
          <main className="flex-1 px-6 md:px-12 py-10 lg:py-16 w-full">
            {/* Max-width agar konten tidak terlalu melebar ke kanan di monitor besar */}
            <div className="mx-auto max-w-6xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/surat/:nomor" element={<Detail />} />
                <Route path="/sholat" element={<JadwalSholat />} />
              </Routes>
            </div>
          </main>

          {/* FOOTER: Sekarang ada di dalam wrapper yang terdorong sidebar */}
          <Footer />
        </div>

        {/* MOBILE NAV: Navigasi bawah untuk HP */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
