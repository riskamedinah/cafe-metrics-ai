import AuthBanner from './AuthBanner'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:block lg:w-[46%] xl:w-[45%] p-4">
        <div className="sticky top-4 h-[calc(100vh-2rem)] rounded-3xl bg-white p-2 overflow-hidden">
          <AuthBanner />
        </div>
      </div>

      <div className="w-full lg:w-[54%] xl:w-[55%] flex items-center justify-center px-6 py-12 lg:px-16">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout