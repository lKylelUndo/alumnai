import ProfiecienyScale from "@/components/common/ProfiecienyScale"
import { Card } from "@/components/ui/card"
import AlumniCoreSkills from "./AlumniCoreSkills"
import AlumniToolsTechnology from "./AlumniToolsTechnology"

const AlumniProfileAbout = () => {
  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-4 text-2xl font-bold text-[#1A216D]">About</h2>
      <p className="mb-8 text-sm leading-relaxed text-gray-700">
        I'm a full-stack software engineer specializing in developing solutions
        with JavaScript, Python, and PHP. I work on projects including building
        modern web applications, mobile apps, search engine optimization,
        digital marketing, and making code tutorials.
      </p>

      <h2 className="mb-6 text-2xl font-bold text-[#1A216D]">Skills</h2>

      <div className="space-y-6">
        {/* Core Skills */}
        <AlumniCoreSkills />

        {/* Tools & Technology */}
        <AlumniToolsTechnology />
      </div>

      {/* Proficiency Scale */}
      <ProfiecienyScale />
    </Card>
  )
}

export default AlumniProfileAbout
