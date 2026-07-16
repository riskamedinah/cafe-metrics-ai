import { Plus } from "lucide-react";

const CreateButton = ({ onClick, label = "Tambah" }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-[#3A72D4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3451C7] whitespace-nowrap"
    >
      <Plus size={18} strokeWidth={2} />
      {label}
    </button>
  );
};

export default CreateButton;