const ProfiecienyScale = () => {
  return (
    <div className="mt-12 border-t border-gray-100 pt-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-800">
        Proficiency Scale
      </h3>
      <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF3B30]"></span>{" "}
          Beginner
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF9500]"></span> Basic
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFC000]"></span>{" "}
          Intermediate
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00C7BE]"></span>{" "}
          Advanced
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00B050]"></span> Expert
        </div>
      </div>
    </div>
  )
}

export default ProfiecienyScale
