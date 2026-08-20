"use client";

import { useAuthContext } from "@/context/AuthContext";
import ProfileRecognitionsCard from "@/components/common/profile/ProfileRecognitionsCard";

const AlumniRecognition = () => {
  const { user } = useAuthContext();

  return (
    <ProfileRecognitionsCard
      recognitions={user?.receivedRecognitions || []}
    />
  );
};

export default AlumniRecognition;
