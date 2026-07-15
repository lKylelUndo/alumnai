import Image from "next/image";

import StudentBadge from "./StudentBadge";
import ContactInfo from "./ContactInfo";
import ProfileActions from "./ProfileActions";

import { Profile } from "@/lib/types/profile";

interface Props {
  profile: Profile;
}

export default function ProfileCard({
  profile,
}: Props) {
  return (
    <section className="rounded-lg border-1 border-[#A4B1CC] bg-white p-8 shadow-md">

      <div className="flex justify-between">

        {/* Left Side */}

        <div className="flex gap-6">

          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2">  
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={60}
            height={60}
            className="object-cover"
          />
          </div>

          <div>

            <div className="flex items-center gap-4">

              <h1 className="text-3xl font-bold text-[#1A216D]">
                {profile.name}
              </h1>

              <StudentBadge role={profile.role} />

            </div>

            <div className="mt-2">

              <ContactInfo
                studentId={profile.studentId}
                email={profile.email}
                github={profile.github}
              />

            </div>

          </div>

        </div>

        {/* Right Side */}

        <ProfileActions />

      </div>

    </section>
  );
}