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
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/login', form)
            if (res.data.status) {
                login(res.data.data.user, res.data.data.access_token)
                navigate('/dashboard')
            } else {
                setError(res.data.message)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal, coba lagi.')
        } finally {
            setLoading(false)
        }
    }


    return (
    <AuthLayout>
         <div ref={formRef} className="w-full max-w-xl">  
  <div className="w-full max-w-xl">  
    {/* Header */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-semibold text-gray-900">Login</h2> 
      <p className="text-gray-500 text-base mt-1">
        Masukkan email dan password untuk mengakses ke akun Anda
      </p>
    </div>

    {/* Pemberitahuan Error*/}
    {error && (
      <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-base"> 
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">
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
        placeholder="Masukkan password Anda"
        required
      />

      {/* Remember & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#3B5BDB] focus:ring-[#3B5BDB]"
          />
          <span className="text-sm text-gray-500">Ingatkan saya</span>
        </label>
        <button type="button" className="text-sm text-[#3B5BDB] font-medium hover:underline">Lupa Password?</button>
      </div>

      {/* Submit Button */}
      <Button type="submit" loading={loading}>
        Login
      </Button>
    </form>

    {/* Link to Register */}
    <p className="text-center text-base text-gray-500 mt-6">  {/* ← text-sm jadi text-base */}
      Tidak punya akun?{' '}
      <Link to="/register" className="text-[#3B5BDB] font-medium hover:underline">
        Daftar Sekarang.
      </Link>
    </p>
  </div>
  </div>
</AuthLayout>
    )
}


export default LoginPage