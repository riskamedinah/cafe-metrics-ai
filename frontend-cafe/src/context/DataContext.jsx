import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/axios";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // State untuk menyimpan data
  const [barang, setBarang] = useState(null);
  const [kategori, setKategori] = useState(null);
  const [penjualan, setPenjualan] = useState(null);
  const [ringkasan, setRingkasan] = useState(null);
  const [dashboard, setDashboard] = useState(null); // { stats, chart, table }

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

  // ─── Fetch Penjualan ───
  const fetchPenjualan = useCallback(async (force = false) => {
    if (!force && penjualan !== null) return;
    setLoadingPenjualan(true);
    try {
      const res = await api.get("/penjualan");
      if (res.data.status) {
        const raw = res.data.data.data || res.data.data;
        const mapped = raw.map((item) => ({
          id: item.id,
          namaProduk: item.barang?.nama_barang || "Tidak diketahui",
          harga: item.barang?.harga_barang || 0,
          jumlah: item.jumlah,
        }));
        setPenjualan(mapped);
      }
    } catch (err) {
      console.error("Gagal fetch penjualan:", err);
    } finally {
      setLoadingPenjualan(false);
    }
  }, [penjualan]);

  // ─── Fetch Ringkasan ───
  const fetchRingkasan = useCallback(async (force = false) => {
    if (!force && ringkasan !== null) return;
    setLoadingRingkasan(true);
    try {
      const res = await api.get("/ringkasan");
      if (res.data.status) {
        const raw = res.data.data.data || res.data.data;
        const mapped = raw.map((item) => ({
          id: item.id,
          bulan: [
            "Januari","Februari","Maret","April","Mei","Juni",
            "Juli","Agustus","September","Oktober","November","Desember"
          ][item.bulan - 1] || "Tidak diketahui",
          tahun: item.tahun,
          totalPenjualan: 0,
          totalPendapatan: item.total_omzet,
          ringkasanAI: item.analisis_ai || "",
        }));
        setRingkasan(mapped);
      }
    } catch (err) {
      console.error("Gagal fetch ringkasan:", err);
    } finally {
      setLoadingRingkasan(false);
    }
  }, [ringkasan]);

  // ─── Fetch Dashboard ───
  const fetchDashboard = useCallback(async (force = false) => {
    if (!force && dashboard !== null) return;
    setLoadingDashboard(true);
    try {
      // Ambil data dashboard (statistik + chart)
      const dashRes = await api.get("/dashboard");
      let stats = {}, chart = [];
      if (dashRes.data.status) {
        const { total_penjualan, total_pendapatan, chart_data } = dashRes.data.data;
        // Ambil total produk & kategori dari endpoint terpisah
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

      // Ambil 5 penjualan terakhir untuk tabel
      const penRes = await api.get("/penjualan?per_page=5");
      let table = [];
      if (penRes.data.status) {
        const raw = penRes.data.data.data || penRes.data.data;
        table = raw.map((item) => ({
          id: item.id,
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
  const refreshPenjualan = () => fetchPenjualan(true);
  const refreshRingkasan = () => fetchRingkasan(true);
  const refreshDashboard = () => fetchDashboard(true);

  return (
    <DataContext.Provider
      value={{
        barang, kategori, penjualan, ringkasan, dashboard,
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