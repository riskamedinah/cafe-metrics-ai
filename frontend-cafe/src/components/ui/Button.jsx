const Button = ({
    children,
    type = 'button',
    loading = false,
    disabled = false,
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className="w-full bg-[#3A72D4] hover:bg-[#3451c7] text-white py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
        {loading ? 'Memproses...' : children}
        </button>
    )
}

export default Button