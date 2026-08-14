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
        <label className="block text-[13px] font-semibold text-[#1E1F24] mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#3A72D4] transition ${
          !value ? "text-[#9CA3AF]" : "text-[#374151]"
        } ${error ? "border-red-400" : "border-[#DDE1E7]"}`}
      >
        {placeholder && (
          <option value="" disabled className="text-[#9CA3AF]">
            {placeholder}
          </option>
        )}
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} className="text-[#374151]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;