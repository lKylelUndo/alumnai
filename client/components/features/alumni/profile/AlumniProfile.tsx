import AlumniRecognition from "./AlumniRecognition"
import Certifications from "@/components/common/layout/Certifications"
import AlumniProfileHeader from "./AlumniProfileHeader"
import AlumniProfileAbout from "./AlumniProfileAbout"

const AlumniProfile = () => {
  return (
    <div className="mx-auto mt-4 w-full max-w-[1200px] p-4 md:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Header Card */}
          <AlumniProfileHeader />

          {/* About & Skills Card */}
          <AlumniProfileAbout />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          {/* My Recognitions */}
          <AlumniRecognition />

          {/* Certifications */}
          <Certifications />
        </div>
      </div>
    </div>
  )
}

export default AlumniProfile
