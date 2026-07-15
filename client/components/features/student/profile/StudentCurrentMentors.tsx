import { Card } from "@/components/ui/card"
import { Award, User } from "lucide-react"

const StudentCurrentMentors = () => {
  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-full bg-[#F0F4FF] p-2 text-[#1A216D]">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1A216D]">My Mentors</h2>
          <p className="mt-1 text-xs text-gray-500">
            Mentors placeholder text
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Item 1 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A216D]">
                  Bernard Bioco
                </p>
                <p className="text-[10px] text-gray-500">21 APR 2026</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">
              Capstone Mentor
            </span>
          </div>
          <div className="rounded-lg bg-[#F5F5F5] p-3 text-xs leading-relaxed text-gray-600">
            Thank you for your guidance and support throughout the project.
          </div>
        </div>

        {/* Item 2 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A216D]">
                  Romel Premacio
                </p>
                <p className="text-[10px] text-gray-500">22 APR 2026</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">
              Career Coach
            </span>
          </div>
          <div className="rounded-lg bg-[#F5F5F5] p-3 text-xs leading-relaxed text-gray-600">
            Thank you for sharing your knowledge and experience.
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StudentCurrentMentors
