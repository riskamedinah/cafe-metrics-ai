import React from "react";
import { Search } from "lucide-react";

const BaseSearch = ({ value, onChange, placeholder = "Cari...", ...props }) => {
  return (
    <div
      className={`
        flex items-center gap-2.5 
        bg-white border border-[#DDE1E7] rounded-lg 
        px-3.5 py-2.5 
        w-full sm:max-w-[340px]
      `}
    >
      <Search size={20} className="text-neutral-500 flex-shrink-none" strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className="border-none outline-none bg-transparent w-full text-sm text-neutral-900 placeholder:text-neutral-400 font-inherit"
      />
    </div>
  );
};

export default BaseSearch;