import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'

const RegisterPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

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
    setErrors({ ...errors, [e.target.name]: '' })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setErrors({})

    try {
      const res = await api.post('/register', form)
      if (res.data.status) {
        login(res.data.data.user, res.data.data.access_token)
        navigate('/dashboard')
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setError(err.response?.data?.message || 'Registrasi gagal, coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div ref={formRef} className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-medium text-gray-900">Register</h2>
          <p className="text-gray-500 text-md mt-1">
            Isi nama, email, dan password untuk membuat akun Anda.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Nama"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama Anda"
            error={errors.name?.[0]}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email Anda"
            error={errors.email?.[0]}
            required
          />

          <PasswordField
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password Anda"
            error={errors.password?.[0]}
            required
          />

          <Button type="submit" loading={loading}>
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#3B5BDB] font-medium hover:underline">
            Masuk sekarang.
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default RegisterPage