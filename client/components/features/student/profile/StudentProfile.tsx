import StudentCurrentMentors from "./StudentCurrentMentors"
import Certifications from "@/components/common/layout/Certifications"
import StudentProfileHeader from "./StudentProfileHeader"
import StudentProfileAbout from "./StudentProfileAbout"
import StudentProfileSkills from "./StudentProfileSkills"

const StudentProfile = () => {
  return (
    <div className="bg-muted/40 lg:min-h-screen">
      <main className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Header / Hero Section - Full Width */}
          <div className="lg:col-span-12">
            <StudentProfileHeader />
          </div>

          {/* Left Column: About & Skills */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <StudentProfileAbout />
            <StudentProfileSkills />
          </div>

          {/* Right Column: Mentors & Certifications */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <StudentCurrentMentors />
            <Certifications />
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentProfile
