import { BrowserRouter, Routes, Route } from "react-router-dom";
import Detail from "./pages/Detail";
import Home from "./components/Skeleton";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    // BrowserRouter: Membungkus seluruh aplikasi untuk routing
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-gray-50 min-h-screen">
        {/* Routes: Container untuk semua Route */}
        <Routes>
          {/* Route: Menghubungkan URL dengan komponen */}
          <Route path="/" element={<Home />} />
          <Route path="/surat/:nomor" element={<Detail />} />
          {/* :nomor adalah parameter dinamis */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
