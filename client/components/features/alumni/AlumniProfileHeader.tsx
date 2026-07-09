import ProfileActions from "@/components/common/ProfileActions"
import { Card } from "@/components/ui/card"
import { Briefcase, GraduationCap, LinkIcon, Mail, User } from "lucide-react"

const AlumniProfileHeader = () => {
  return (
    <Card className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-200">
            <User className="h-12 w-12 text-gray-400" />
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#1A216D]">John Micco</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1877F2] px-3 py-1 text-xs font-medium text-white">
                <GraduationCap className="h-4 w-4" />
                Alumni
              </span>
              <span className="inline-flex items-center rounded-full border border-[#00B050] bg-white px-3 py-1 text-xs font-medium text-[#00B050]">
                Available for Mentoring
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>Junior Frontend Developer @ Absys</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>jmmicooo@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 shrink-0" />
                  <span>LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <ProfileActions />
      </div>
    </Card>
  )
}

export default AlumniProfileHeader
