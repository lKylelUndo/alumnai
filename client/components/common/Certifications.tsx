import { FileBadge } from "lucide-react"
import { Card } from "../ui/card"

const Certifications = () => {
  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-full bg-[#F0F4FF] p-2 text-[#1A216D]">
          <FileBadge className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1A216D]">Certifications</h2>
          <p className="mt-1 text-xs text-gray-500">
            Certifications from verified organizations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Cert 1 */}
        <div className="rounded-lg bg-[#F5F5F5] p-4">
          <p className="text-sm font-bold text-[#1A216D]">Tesda Web Design</p>
          <p className="mt-1 text-xs text-gray-600">Tesda</p>
        </div>

        {/* Cert 2 */}
        <div className="rounded-lg bg-[#F5F5F5] p-4">
          <p className="text-sm font-bold text-[#1A216D]">
            Diploma in Project Management
          </p>
          <p className="mt-1 text-xs text-gray-600">Absys</p>
        </div>
      </div>
    </Card>
  )
}

export default Certifications
