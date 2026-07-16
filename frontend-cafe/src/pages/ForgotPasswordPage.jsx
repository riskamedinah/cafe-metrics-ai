import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import api from '../lib/axios'

const ForgotPasswordPage = () => {
  const formRef = useRef(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await api.post('/forgot-password', { email })
      if (res.data.status) {
        setSuccess(true)
        setEmail('')
      } else {
        setError(res.data.message || 'Gagal mengirim link reset.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div ref={formRef} className="w-full max-w-lg">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-medium text-gray-900">Lupa Password</h2>
          <p className="text-gray-500 text-md mt-1">
            Masukkan email Anda, kami akan kirimkan link untuk mereset password.
          </p>
        </div>

        {success && (
          <div className="mb-4 px-4 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            Link reset password telah dikirim ke email Anda. Cek inbox atau spam.
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email Anda"
            required
            disabled={success}
          />

          <Button type="submit" loading={loading} disabled={success}>
            Kirim Link Reset
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Sudah ingat password?{' '}
          <Link to="/login" className="text-[#3A72D4] font-medium hover:underline">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default ForgotPasswordPage