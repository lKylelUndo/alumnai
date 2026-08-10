import { Card } from "@/components/ui/card"
import { Award, User } from "lucide-react"

const StudentCurrentMentors = () => {
  return (
    <Card className="rounded-xl border border-[#A4B1CC] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-full bg-[#F0F4FF] p-2 text-[#1A216D]">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1A216D]">Current Mentors</h2>
          <p className="mt-0 text-xs text-gray-500">
            Currently have 4 mentors
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Item 1 */}
        <div>
          <div className="mb-2 px-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A216D]">
                  Bernard Bioco
                </p>
                <p className="text-[10px] text-gray-500">Senior Full Stack Developer</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">
              Capstone Mentor
            </span>
          </div>
        </div>

        {/* Item 2 */}
        <div>
          <div className="mb-2 px-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A216D]">
                  Romel Premacio
                </p>
                <p className="text-[10px] text-gray-500">Senior Developer</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">
              Career Coach
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StudentCurrentMentors
