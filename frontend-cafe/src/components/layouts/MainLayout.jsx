import { useState, useRef } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, SlidersHorizontal, BarChart2,
  Sparkles, ChevronDown, Menu, X, LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/axios'
import ConfirmModal from '../modals/ConfirmModal'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/barang': 'Barang',
  '/penjualan': 'Management Penjualan',
  '/barang-management': 'Management Barang',
  '/kategori': 'Management Kategori',
  '/ringkasan': 'Ringkasan Bulanan',
  '/generate': 'Generate Ringkasan',
}

const navBase = 'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-150 cursor-pointer w-full text-left'
const navActive = 'bg-[#3A72D4] text-white'
const navInactive = 'text-black hover:bg-gray-100'

const subNavBase = 'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-base font-medium transition-colors duration-150 cursor-pointer w-full text-left'
const subNavActive = 'bg-[#3A72D4] text-white font-medium'
const subNavInactive = 'text-black hover:bg-gray-100'

const SidebarContent = ({ onClose }) => {
  const [managementOpen, setManagementOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-6 pb-8">
        <div className="flex items-center gap-2.5">
          <img
            src="/src/assets/logo.svg"
            alt="Logo"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <span className="font-medium text-black text-xl leading-tight">Cafe Metrics AI</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 lg:hidden">
            <X size={22} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="text-sm text-gray-600 font-medium px-1 mb-3">General</p>

        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/barang"
          onClick={onClose}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          <Package size={20} />
          Barang
        </NavLink>

        <div>
          <button
            onClick={() => setManagementOpen(!managementOpen)}
            className={`${navBase} ${navInactive} justify-between`}
          >
            <span className="flex items-center gap-3">
              <SlidersHorizontal size={20} />
              Management
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${managementOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {managementOpen && (
            <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
              <NavLink
                to="/penjualan"
                onClick={onClose}
                className={({ isActive }) => `${subNavBase} ${isActive ? subNavActive : subNavInactive}`}
              >
                Penjualan
              </NavLink>
              <NavLink
                to="/barang-management"
                onClick={onClose}
                className={({ isActive }) => `${subNavBase} ${isActive ? subNavActive : subNavInactive}`}
              >
                Barang
              </NavLink>
              <NavLink
                to="/kategori"
                onClick={onClose}
                className={({ isActive }) => `${subNavBase} ${isActive ? subNavActive : subNavInactive}`}
              >
                Kategori
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/ringkasan-bulanan"
          onClick={onClose}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          <BarChart2 size={20} />
          Ringkasan Bulanan
        </NavLink>

        <NavLink
          to="/generate"
          onClick={onClose}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          <Sparkles size={20} />
          Generate Ringkasan
        </NavLink>
      </nav>
    </div>
  )
}

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const timeoutRef = useRef(null)

  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard'

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false)
    try {
      await api.post('/logout')
    } catch (_) {}
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-medium text-black">{pageTitle}</h1>
        </div>

        <div
          className="relative flex items-center gap-3 cursor-pointer select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-9 h-9 rounded-full bg-[#3A72D4] flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>

          <div className="hidden sm:block">
            <p className="text-base font-semibold text-gray-800 leading-tight">
              {user?.name ?? 'User'}
            </p>
            <p className="text-sm text-gray-600 leading-tight">
              {user?.email ?? ''}
            </p>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          />

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setShowLogoutModal(true);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-white font-medium bg-red-500 hover:bg-red-600 transition-colors rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Apakah kamu yakin akan logout dari sistem?"
        confirmText="Logout"
        confirmVariant="danger"
      />
    </>
  )
}

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 flex-none">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl z-50">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout