const InputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    required = false,
}) => {
    return (
        <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-4 py-2.5 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#3A72D4] focus:border-transparent transition ${
                    error ? 'border-red-400' : 'border-gray-300'
                }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}

export default InputField