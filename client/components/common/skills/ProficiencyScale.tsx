const ProfiecienyScale = () => {
  return (
    <div className="mt-10 pt-6 border-t border-[#E2E8F0]">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#434657]">Proficiency Scale</h4>
      <div className="flex flex-wrap gap-4 text-sm text-[#434657]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span> Beginner</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF9500]"></span> Basic</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFC000]"></span> Intermediate</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00C7BE]"></span> Advanced</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00B050]"></span> Expert</span>
      </div>
    </div>
  )
}

export default ProfiecienyScale
