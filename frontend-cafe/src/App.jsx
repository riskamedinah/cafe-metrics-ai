import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './router/ProtectedRoute';  // ← COMMENT INI

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BarangPage from './pages/BarangPage';
import PenjualanPage from './pages/PenjualanPage';
import RingkasanPage from './pages/RingkasanPage';

import MainLayout from './layouts/MainLayout';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* SEMUA ROUTE JADI PUBLIC SEMENTARA */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="barang" element={<BarangPage />} />
                        <Route path="penjualan" element={<PenjualanPage />} />
                        <Route path="ringkasan" element={<RingkasanPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;