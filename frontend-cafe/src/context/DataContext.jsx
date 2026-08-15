import { createContext, useContext, useState, useCallback, useRef } from "react";
import api from "../lib/axios";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [barang, setBarang] = useState(null);
  const [kategori, setKategori] = useState(null);
  const [penjualan, setPenjualan] = useState(null);
  const [penjualanMeta, setPenjualanMeta] = useState({ currentPage: 1, lastPage: 1 });
  const [ringkasan, setRingkasan] = useState(null);
  const [ringkasanMeta, setRingkasanMeta] = useState({ currentPage: 1, lastPage: 1 });
  const [dashboard, setDashboard] = useState(null);

  const barangRef = useRef(null);
  const kategoriRef = useRef(null);
  const penjualanRef = useRef(null);
  const ringkasanRef = useRef(null);
  const dashboardRef = useRef(null);

  barangRef.current = barang;
  kategoriRef.current = kategori;
  penjualanRef.current = penjualan;
  ringkasanRef.current = ringkasan;
  dashboardRef.current = dashboard;

  const [loadingBarang, setLoadingBarang] = useState(false);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingPenjualan, setLoadingPenjualan] = useState(false);
  const [loadingRingkasan, setLoadingRingkasan] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Fetch Barang
  const fetchBarang = useCallback(async (force = false) => {
    if (!force && barangRef.current !== null) return;
    setLoadingBarang(true);
    try {
      const res = await api.get("/barang");
      if (res.data.status) setBarang(res.data.data);
    } catch (err) {
      console.error("Gagal fetch barang:", err);
    } finally {
      setLoadingBarang(false);
    }
  }, []);

  // Fetch Kategori
  const fetchKategori = useCallback(async (force = false) => {
    if (!force && kategoriRef.current !== null) return;
    setLoadingKategori(true);
    try {
      const res = await api.get("/kategori");
      if (res.data.status) setKategori(res.data.data);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    } finally {
      setLoadingKategori(false);
    }
  }, []);

  // Fetch Penjualan
  const fetchPenjualan = useCallback(async (page = 1, force = false) => {
    if (!force && penjualanRef.current !== null && penjualanMeta.currentPage === page) return;
    setLoadingPenjualan(true);
    try {
      const res = await api.get(`/penjualan?page=${page}`);
      if (res.data.status) {
        const paginated = res.data.data;
        const raw = paginated.data || paginated;
        const mapped = raw.map((item) => ({
          id: item.id,
          barangId: item.barang_id,
          namaProduk: item.barang?.nama_barang || "Tidak diketahui",
          harga: item.barang?.harga_barang || 0,
          jumlah: item.jumlah,
        }));
        setPenjualan(mapped);
        setPenjualanMeta({
          currentPage: paginated.current_page || 1,
          lastPage: paginated.last_page || 1,
        });
      }
    } catch (err) {
      console.error("Gagal fetch penjualan:", err);
    } finally {
      setLoadingPenjualan(false);
    }
  }, [penjualanMeta.currentPage]);

  // Fetch Ringkasan
  const fetchRingkasan = useCallback(async (page = 1, force = false) => {
    if (!force && ringkasanRef.current !== null && ringkasanMeta.currentPage === page) return;
    setLoadingRingkasan(true);
    try {
      const res = await api.get(`/ringkasan?page=${page}`);
      if (res.data.status) {
        const paginated = res.data.data;
        const raw = paginated.data || paginated;
        const mapped = raw.map((item) => ({
          id: item.id,
          bulan: [
            "Januari","Februari","Maret","April","Mei","Juni",
            "Juli","Agustus","September","Oktober","November","Desember"
          ][item.bulan - 1] || "Tidak diketahui",
          tahun: item.tahun,
          totalPenjualan: item.total_penjualan,
          totalPendapatan: item.total_omzet,
          ringkasanAI: item.analisis_ai || "",
        }));
        setRingkasan(mapped);
        setRingkasanMeta({
          currentPage: paginated.current_page || 1,
          lastPage: paginated.last_page || 1,
        });
      }
    } catch (err) {
      console.error("Gagal fetch ringkasan:", err);
    } finally {
      setLoadingRingkasan(false);
    }
  }, [ringkasanMeta.currentPage]);

  // Fetch Dashboard
  const fetchDashboard = useCallback(async (force = false) => {
    if (!force && dashboardRef.current !== null) return;
    
    setLoadingDashboard(true);
    try {
      const res = await api.get("/dashboard");
      if (res.data.status) {
        const d = res.data.data;

        const mappedTable = (d.table || []).map((item) => ({
          id: item.id,
          barangId: item.barang_id,
          namaProduk: item.barang?.nama_barang || "Tidak diketahui",
          harga: item.barang?.harga_barang || 0,
          jumlah: item.jumlah,
          totalHarga: item.total_harga,
        }));

        setDashboard({
          stats: {
            totalProduk: d.total_produk,
            totalKategori: d.total_kategori,
            totalPenjualan: d.total_penjualan,
            totalPendapatan: d.total_pendapatan,
          },
          chart: d.chart_data,
          table: mappedTable,
        });
      }
    } catch (err) {
      console.error("Gagal fetch dashboard:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const refreshBarang = () => fetchBarang(true);
  const refreshKategori = () => fetchKategori(true);
  const refreshPenjualan = (page) => fetchPenjualan(page || penjualanMeta.currentPage, true);
  const refreshRingkasan = (page) => fetchRingkasan(page || ringkasanMeta.currentPage, true);
  const refreshDashboard = () => fetchDashboard(true);

  const preloadInitialData = useCallback(async () => {
    await fetchDashboard(true);
  }, [fetchDashboard]);

  return (
    <DataContext.Provider
      value={{
        barang, kategori, penjualan, ringkasan, dashboard,
        penjualanMeta, ringkasanMeta,
        loadingBarang, loadingKategori, loadingPenjualan, loadingRingkasan, loadingDashboard,
        fetchBarang, fetchKategori, fetchPenjualan, fetchRingkasan, fetchDashboard,
        refreshBarang, refreshKategori, refreshPenjualan, refreshRingkasan, refreshDashboard,
        preloadInitialData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);