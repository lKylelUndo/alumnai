import Image from "next/image";
import { Mentor } from "@/lib/types/profile";

interface Props {
  mentor: Mentor;
}

export default function MentorItem({
  mentor,
}: Props) {
  return (
    <div className="flex items-center gap-4">

    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2">
      <Image
        src={mentor.avatar}
        alt={mentor.name}
        width={52}
        height={52}
        className="object-cover"
      />
      </div>

      <div>
        <h5 className="font-semibold text-[#1A216D]">
          {mentor.name}
        </h5>

        <p className="text-xs text-gray-500">
          {mentor.position}
        </p>

        <p className="text-xs text-gray-500">
          @ {mentor.company}
        </p>
      </div>
    </div>
  );
}