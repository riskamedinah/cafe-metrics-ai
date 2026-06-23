import { Package, TrendingDown, ShoppingCart, Wallet } from "lucide-react";

export const STAT_CARDS = [
  {
    id: "penjualan-hari",
    label: "Penjualan Hari Ini",
    value: "4",
    icon: Package,
  },
  {
    id: "pendapatan-hari",
    label: "Pendapatan Hari Ini",
    value: "Rp 1.000.000",
    icon: TrendingDown,
  },
  {
    id: "penjualan-bulan",
    label: "Penjualan Bulan Ini",
    value: "5",
    icon: ShoppingCart,
  },
  {
    id: "pendapatan-bulan",
    label: "Pendapatan Bulan Ini",
    value: "Rp 1.250.000",
    icon: Wallet,
  },
];

export const CHART_DATA = [
  { minggu: "Minggu 1", totalPenjualan: 2, totalHarga: 150000 },
  { minggu: "Minggu 2", totalPenjualan: 4, totalHarga: 350000 },
  { minggu: "Minggu 3", totalPenjualan: 3, totalHarga: 250000 },
  { minggu: "Minggu 4", totalPenjualan: 5, totalHarga: 400000 },
];

export const DASHBOARD_TABLE_DATA = [
  {
    id: 1,
    namaProduk: "Sepatu Running",
    harga: 100000,
    jumlah: 2,
  },
  {
    id: 2,
    namaProduk: "Baju Sporty",
    harga: 150000,
    jumlah: 1,
  },
];