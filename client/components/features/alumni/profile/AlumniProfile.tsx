import AlumniRecognition from "./AlumniRecognition"
import Certifications from "@/components/common/layout/Certifications"
import AlumniProfileHeader from "./AlumniProfileHeader"
import AlumniProfileAbout from "./AlumniProfileAbout"
import AlumniProfileSkills from "./AlumniProfileSkills"

const AlumniProfile = () => {
  return (
    <div className="bg-muted/40 lg:min-h-screen">
      <main className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Header / Hero Section - Full Width */}
          <div className="lg:col-span-12">
            <AlumniProfileHeader />
          </div>

          {/* Left Column: About & Skills */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AlumniProfileAbout />
            <AlumniProfileSkills />
          </div>

          {/* Right Column: Recognitions & Certifications */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <AlumniRecognition />
            <Certifications />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AlumniProfile
