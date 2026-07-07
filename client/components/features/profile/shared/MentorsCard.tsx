import { Mentor } from "@/types/profile";

import MentorItem from "@/components/features/profile/student/MentorItem";
import SectionCard from "./SectionCard";

interface Props {
  mentors: Mentor[];
}

export default function MentorsCard({
  mentors,
}: Props) {
  return (
    <SectionCard title="Current Mentors" subtitle="Currently have n mentors">
      <div className="space-y-5">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <MentorItem
              key={mentor.id}
              mentor={mentor}
            />
          ))
        ) : (
          <p className="text-gray-500">
            No mentors assigned.
          </p>
        )}
      </div>
    </SectionCard>
  );
}