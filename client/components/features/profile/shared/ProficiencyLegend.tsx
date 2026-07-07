const levels = [
  {
    label: "Beginner",
    color: "bg-red-500",
  },
  {
    label: "Basic",
    color: "bg-orange-500",
  },
  {
    label: "Intermediate",
    color: "bg-yellow-500",
  },
  {
    label: "Advanced",
    color: "bg-emerald-500",
  },
  {
    label: "Expert",
    color: "bg-green-600",
  },
];

export default function ProficiencyLegend() {
  return (
    <div className="mt-10">

      <h3 className="mb-4 font-semibold text-[#1A216D]">
        Proficiency Scale
      </h3>

      <div className="flex flex-wrap gap-6 rounded-full bg-slate-50 px-6 py-3">

        {levels.map((level) => (
          <div
            key={level.label}
            className="flex items-center gap-2"
          >
            <span
              className={`h-3 w-3 rounded-full ${level.color}`}
            />

            <span className="text-sm font-medium">
              {level.label}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}