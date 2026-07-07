import { profile } from "@/lib/data/profile";

import ProfileCard from "@/components/features/profile/shared/ProfileCard";
import ProfileDetailsCard from "@/components/features/profile/shared/ProfileDetailsCard";
import MentorsCard from "@/components/features/profile/shared/MentorsCard";
import CertificationsCard from "@/components/features/profile/shared/CertificationsCard";

export default function StudentProfilePage() {
  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="grid grid-cols-13 gap-6">

        <div className="col-span-9 space-y-6">
         <ProfileCard profile={profile} />

            <ProfileDetailsCard
                about={profile.about}
                skills={profile.skills}
            />
        </div>

        <div className="col-span-4 space-y-6">
          <MentorsCard
            mentors={profile.mentors}
          />

          <CertificationsCard
            certifications={profile.certifications}
          />
        </div>

      </div>
    </main>
  );
}