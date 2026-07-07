import { Download, Pencil } from "lucide-react";

interface Props {
  onDownload?: () => void;
  onEdit?: () => void;
}

export default function ProfileActions({
  onDownload,
  onEdit,
}: Props) {
  return (
    <div className="flex flex-col gap-4">

      <button
        onClick={onDownload}
        className="flex items-center justify-center gap-2 rounded-xl border border-[#1A216D] px-3 py-1 text-[#1A216D] text-sm font-semibold transition hover:bg-slate-50"
      >
        <Download size={18} />

        Download Profile
      </button>

      <button
        onClick={onEdit}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#3478E5] px-3 py-1.5 text-white text-sm font-medium transition hover:bg-[#2868d1]"
      >
        <Pencil size={18} />
        Update Profile
      </button>

    </div>
  );
}