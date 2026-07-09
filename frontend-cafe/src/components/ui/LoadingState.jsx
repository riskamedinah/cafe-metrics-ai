export default function LoadingState({ text = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-7 h-7 border-[3px] border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#9A9BAA]">{text}</p>
    </div>
  );
}