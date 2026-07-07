import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'

const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const formRef = useRef(null)

    const [form, setForm] = useState({ email: '', password: ''})
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollIntoView({
                behavior: 'smooth', 
                block: 'center', 
            })
        }
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

   const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const res = await api.post('/login', form);
    if (res.data.status) {
      login(res.data.data.user, res.data.data.access_token, remember);
      navigate('/dashboard');
    } else {
      setError(res.data.message);
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login gagal, coba lagi.');
  } finally {
    setLoading(false);
  }
};

    return (
        <AuthLayout>
            <div ref={formRef} className="w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-medium text-gray-900">Login</h2> 
                    <p className="text-gray-500 text-base mt-1">
                        Masukkan email dan password untuk mengakses akun Anda
                    </p>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"> 
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField 
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Masukkan email Anda"
                        required
                    />

                    <PasswordField 
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Masukkan Password Anda"
                        required
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#3B5BDB] focus:ring-[#3B5BDB]"
                            />
                            <span className="text-sm text-gray-500">Ingatkan saya</span>
                        </label>
                        <button type="button" className="text-sm text-[#3B5BDB] font-medium hover:underline">
                            Lupa Password?
                        </button>
                    </div>

                    <Button type="submit" loading={loading}>
                        Login
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Tidak punya akun?{' '}
                    <Link to="/register" className="text-[#3B5BDB] font-medium hover:underline">
                        Daftar sekarang.
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}

export default LoginPage