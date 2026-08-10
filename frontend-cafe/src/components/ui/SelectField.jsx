import React from "react";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = "Pilih opsi...",
  required = false,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-base font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2.5 border rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#3A72D4] focus:border-transparent transition ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
