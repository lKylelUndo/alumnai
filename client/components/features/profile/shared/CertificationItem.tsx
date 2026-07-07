import { Certification } from "@/types/profile";

interface Props {
  certification: Certification;
}

export default function CertificationItem({
  certification,
}: Props) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <h3 className="font-semibold text-[#1A216D]">
        {certification.title}
      </h3>

      <p className="text-sm text-gray-600">
        {certification.issuer}
      </p>
    </div>
  );
}