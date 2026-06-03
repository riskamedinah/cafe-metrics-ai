import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuth } = useAuth();
    return isAuth ? children : <Navigate to="/login" replace />;
};

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import BarangPage from '../pages/BarangPage';
import PenjualanPage from '../pages/PenjualanPage';
import RingkasanPage from '../pages/RingkasanPage';
import GenerateRingkasanPage from '../pages/GenerateRingkasanPage';

import MainLayout from '../layouts/MainLayout';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                   

                    {/* Protected */}
                   <Route path="/" elements={
                        <ProtectedRoute>
                            <MainLayout />
                                </ProtectedRoute>}>

                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/barang" element={<BarangPage />} />
                    <Route path="/penjualan" element={<PenjualanPage />} />
                    <Route path="/ringkasan" element={<RingkasanPage />} />  
        </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    )
}


export default ProtectedRoute;