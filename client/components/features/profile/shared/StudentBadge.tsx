interface StudentBadgeProps {
  role: "Student" | "Alumni";
}

export default function StudentBadge({
  role,
}: StudentBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#3478E5] px-4 py-1 text-sm text-white">
      {role}
    </span>
  );
}