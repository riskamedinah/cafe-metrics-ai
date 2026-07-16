import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'
import api from '../lib/axios'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const emailFromUrl = searchParams.get('email')

  const formRef = useRef(null)

  const [form, setForm] = useState({
    email: emailFromUrl || '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // Jika tidak ada token di URL, arahkan ke halaman lupa password
    if (!token) {
      navigate('/forgot-password', { replace: true })
    }
  }, [token, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const payload = {
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        token: token,
      }
      const res = await api.post('/reset-password', payload)
      if (res.data.status) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError(res.data.message || 'Gagal mereset password.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return null // atau loading
  }

  return (
    <AuthLayout>
      <div ref={formRef} className="w-full max-w-lg">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-medium text-gray-900">Reset Password</h2>
          <p className="text-gray-500 text-md mt-1">
            Masukkan password baru Anda.
          </p>
        </div>

        {success && (
          <div className="mb-4 px-4 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            Password berhasil direset! Anda akan dialihkan ke halaman login.
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <PasswordField
            label="Password Baru"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password baru (min 8 karakter)"
            required
            disabled={success}
          />

          <PasswordField
            label="Konfirmasi Password Baru"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Ulangi password baru"
            required
            disabled={success}
          />

          <Button type="submit" loading={loading} disabled={success}>
            Reset Password
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link to="/login" className="text-[#3A72D4] font-medium hover:underline">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default ResetPasswordPage