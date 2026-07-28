// export default async function ViewProfilePage({ params }: { params: Promise<{ userId: string }> }) {
//   const { userId } = await params
//   return (
//     <div>
//       <h1>View Profile</h1>
//     </div>
//   )
// }

import ViewProfile from "@/components/common/ViewProfile";

export default function ViewProfilePage() {
  return (
    <>
      <ViewProfile 
        profileRole="student"
        viewerRole="alumni"/>
        {/* test drive baby */}
    </>
  );    
}

