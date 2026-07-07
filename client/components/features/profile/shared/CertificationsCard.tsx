import { Certification } from "@/types/profile";

import CertificationItem from "./CertificationItem";
import SectionCard from "./SectionCard";

interface Props {
  certifications: Certification[];
}

export default function CertificationsCard({
  certifications,
}: Props) {
  return (
    <SectionCard title="Certifications" subtitle="Certifications from verified organizations">
      <div className="space-y-4">
        {certifications.length > 0 ? (
          certifications.map((certification) => (
            <CertificationItem
              key={certification.id}
              certification={certification}
            />
          ))
        ) : (
          <p className="text-gray-500">
            No certifications available.
          </p>
        )}
      </div>
    </SectionCard>
  );
}