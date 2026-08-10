import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/axios";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // State untuk menyimpan data
  const [barang, setBarang] = useState(null);
  const [kategori, setKategori] = useState(null);
  const [penjualan, setPenjualan] = useState(null);
  const [penjualanMeta, setPenjualanMeta] = useState({ currentPage: 1, lastPage: 1 });
  const [ringkasan, setRingkasan] = useState(null);
  const [ringkasanMeta, setRingkasanMeta] = useState({ currentPage: 1, lastPage: 1 });
  const [dashboard, setDashboard] = useState(null);

  // Loading flags
  const [loadingBarang, setLoadingBarang] = useState(false);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingPenjualan, setLoadingPenjualan] = useState(false);
  const [loadingRingkasan, setLoadingRingkasan] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // ─── Fetch Barang ───
  const fetchBarang = useCallback(async (force = false) => {
    if (!force && barang !== null) return;
    setLoadingBarang(true);
    try {
      const res = await api.get("/barang");
      if (res.data.status) setBarang(res.data.data);
    } catch (err) {
      console.error("Gagal fetch barang:", err);
    } finally {
      setLoadingBarang(false);
    }
  }, [barang]);

  // ─── Fetch Kategori ───
  const fetchKategori = useCallback(async (force = false) => {
    if (!force && kategori !== null) return;
    setLoadingKategori(true);
    try {
      const res = await api.get("/kategori");
      if (res.data.status) setKategori(res.data.data);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    } finally {
      setLoadingKategori(false);
    }
  }, [kategori]);

  // ─── Fetch Penjualan (dengan pagination) ───
  const fetchPenjualan = useCallback(async (page = 1) => {
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
  }, []);

  // ─── Fetch Ringkasan (dengan pagination) ───
  const fetchRingkasan = useCallback(async (page = 1) => {
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
  }, []);

  // ─── Fetch Dashboard ───
  const fetchDashboard = useCallback(async (force = false) => {
    if (!force && dashboard !== null) return;
    setLoadingDashboard(true);
    try {
      const dashRes = await api.get("/dashboard");
      let stats = {}, chart = [];
      if (dashRes.data.status) {
        const { total_penjualan, total_pendapatan, chart_data } = dashRes.data.data;
        const [barangRes, kategoriRes] = await Promise.all([
          api.get("/barang"),
          api.get("/kategori"),
        ]);
        const totalProduk = barangRes.data.status ? barangRes.data.data.length : 0;
        const totalKategori = kategoriRes.data.status ? kategoriRes.data.data.length : 0;

        stats = {
          totalProduk,
          totalKategori,
          totalPenjualan: total_penjualan,
          totalPendapatan: total_pendapatan,
        };
        chart = chart_data;
      }

      const penRes = await api.get("/penjualan?per_page=5");
      let table = [];
      if (penRes.data.status) {
        const raw = penRes.data.data.data || penRes.data.data;
        table = raw.map((item) => ({
          id: item.id,
           barangId: item.barang_id,
          namaProduk: item.barang?.nama_barang || "Tidak diketahui",
          harga: item.barang?.harga_barang || 0,
          jumlah: item.jumlah,
        }));
      }

      setDashboard({ stats, chart, table });
    } catch (err) {
      console.error("Gagal fetch dashboard:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }, [dashboard]);

  // ─── Refresh (force) functions ───
  const refreshBarang = () => fetchBarang(true);
  const refreshKategori = () => fetchKategori(true);
  const refreshPenjualan = (page) => fetchPenjualan(page || penjualanMeta.currentPage);
  const refreshRingkasan = (page) => fetchRingkasan(page || ringkasanMeta.currentPage);
  const refreshDashboard = () => fetchDashboard(true);

  return (
    <DataContext.Provider
      value={{
        barang, kategori, penjualan, ringkasan, dashboard,
        penjualanMeta, ringkasanMeta,
        loadingBarang, loadingKategori, loadingPenjualan, loadingRingkasan, loadingDashboard,
        fetchBarang, fetchKategori, fetchPenjualan, fetchRingkasan, fetchDashboard,
        refreshBarang, refreshKategori, refreshPenjualan, refreshRingkasan, refreshDashboard,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);