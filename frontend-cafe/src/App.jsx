import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './router/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BarangPage from './pages/BarangPage';
import PenjualanPage from './pages/PenjualanPage';
import RingkasanPage from './pages/RingkasanBulananPage';
import BarangManagementPage from './pages/BarangManagement';
import KategoriPage from './pages/KategoriPage';
import GenerateRingkasanPage from './pages/GenerateRingkasanPage';
import { DataProvider } from './context/DataContext';

import MainLayout from './layouts/MainLayout';

function App() {
    return (
        <AuthProvider>
              <DataProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="barang" element={<BarangPage />} />
                    <Route path="penjualan" element={<PenjualanPage />} />
                    <Route path="ringkasan-bulanan" element={<RingkasanPage />} />
                    <Route path="barang-management" element={<BarangManagementPage />} />
                    <Route path="kategori" element={<KategoriPage />} />
                    <Route path="generate" element={<GenerateRingkasanPage />} />
                </Route>
                </Routes>
            </BrowserRouter>
              </DataProvider>
        </AuthProvider>
    );
}

export default App;