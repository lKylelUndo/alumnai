import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const AlumniToolsTechnology = () => {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-800">
        Tools & Technology
      </h3>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700">
          Adobe
          <Tooltip>
            <TooltipTrigger className="h-2 w-2 rounded-full bg-[#00B050]"></TooltipTrigger>
            <TooltipContent>
              <p>
                I use adobe for making draft posters and also mockup websites
                animation
              </p>
            </TooltipContent>
          </Tooltip>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700">
          Figma
          <span className="h-2 w-2 rounded-full bg-[#00B050]"></span>
        </span>
      </div>
    </div>
  )
}

export default AlumniToolsTechnology
