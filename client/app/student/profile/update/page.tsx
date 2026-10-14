import { Suspense } from "react";
import UpdateProfileForm from "@/components/common/profile/UpdateProfileForm";

export default function UpdateProfilePage() {
  return (
    <Suspense fallback={null}>
      <UpdateProfileForm />
    </Suspense>
  );
}