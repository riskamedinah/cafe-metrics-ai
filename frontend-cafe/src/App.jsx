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
import { ToastProvider } from "./components/ui/Notification";
import { DataProvider } from './context/DataContext';
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

import MainLayout from './layouts/MainLayout';

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <DataProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />

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
        </ToastProvider>
    );
}

export default App;