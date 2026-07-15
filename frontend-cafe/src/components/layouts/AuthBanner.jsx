import logo from '../../assets/logo-auth.svg'
import dashboardPreview from '../../assets/banner-auth.svg'

const AuthBanner = () => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#3B5BDB] rounded-3xl">
      <div className="shrink-0 px-6 pt-10 lg:px-12 lg:pt-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-xl font-semibold leading-tight text-white">
            Cafe Metrics AI
          </span>
        </div>

        <h1 className="mt-6 max-w-lg text-4xl font-medium leading-[1.2] text-white">
          Selamat Datang Di Aplikasi Inventory Management{''}
          <span className="inline-block">👋🏻</span>
        </h1>
      </div>

      {/* Gambar dashboard – tetap di kanan bawah, responsif */}
      <div className="flex flex-1 items-end justify-end">
        <div className="w-full mt-10 overflow-hidden">
          <img
            src={dashboardPreview}
            alt="Preview dashboard"
            className="block h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default AuthBanner