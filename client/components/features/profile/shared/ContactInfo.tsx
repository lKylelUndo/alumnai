import Link from "next/link";
import { Mail, Link2, IdCard } from "lucide-react";

interface ContactInfoProps {
  studentId: string;
  email: string;
  github: string;
}

export default function ContactInfo({
  studentId,
  email,
  github,
}: ContactInfoProps) {
  return (
    <div className="space-y-2 text-gray-600 text-sm">

      <div className="flex items-center gap-3">
        <IdCard
          size={20}
          className="text-[#1A216D]"
        />

        <span>ID: {studentId}</span>
      </div>

      <div className="flex items-center gap-3">
        <Mail
          size={20}
          className="text-[#1A216D]"
        />

        <span>{email}</span>
      </div>

      <div className="flex items-center gap-3">
        <Link2
          size={20}
          className="text-[#1A216D]"
        />

        <Link
          href={github}
          target="_blank"
          className="hover:text-[#3478E5]"
        >
          GitHub
        </Link>
      </div>
    </div>
  );
}