import React from "react";
import { Search } from "lucide-react";

const BaseSearch = ({ value, onChange, placeholder = "Cari...", ...props }) => {
  return (
    <div className="flex items-center gap-2.5 bg-white border border-[#DDE1E7] rounded-lg px-3.5 py-2.5 w-full sm:max-w-85">
      <Search size={25} className="text-[#5E5E5E] shrink-0" strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className="border-none outline-none bg-transparent w-full text-[15px] text-[#5E5E5E] placeholder:text-[#5E5E5E] font-inherit"
      />
    </div>
  );
};

export default BaseSearch;