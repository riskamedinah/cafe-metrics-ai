import authBanner from '../../assets/auth_banner.svg'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Banner Image */}
      <div className="hidden lg:flex lg:w-[50%] items-center justify-center py-8 px-6">
        <img 
          src={authBanner}
          alt="Cafe Metrics AI"
          className="object-contain w-[95%]"
        />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-12 py-8 bg-white">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout