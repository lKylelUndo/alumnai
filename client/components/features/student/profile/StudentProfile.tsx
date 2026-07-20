import StudentCurrentMentors from "./StudentCurrentMentors"
import Certifications from "@/components/common/Certifications"
import StudentProfileHeader from "./StudentProfileHeader"
import StudentProfileAbout from "./StudentProfileAbout"

const StudentProfile = () => {
  return (
    <div className="mx-auto mt-4 w-full max-w-[1200px] p-4 md:p-8 bg-[#FAF9F6]">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Header Card */}
          <StudentProfileHeader />

          {/* About & Skills Card */}
          <StudentProfileAbout />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          {/* My Mentors */}
          <StudentCurrentMentors />

          {/* Certifications */}
          <Certifications />
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
