// Maps a 1-5 level to its proficiency color.
// Deliberately not theme-bound: these are semantic status colors, kept in one
// place so the skill dots and the legend can never drift apart.
export const getProficiencyColor = (level?: number): string => {
  if (!level) return "#D1D5DB" // gray fallback if no level set
  if (level <= 1) return "#FF3B30" // Beginner
  if (level <= 2) return "#FF9500" // Basic
  if (level <= 3) return "#FFC000" // Intermediate
  if (level <= 4) return "#00C7BE" // Advanced
  return "#00B050" // Expert
}

export const getProficiencyLabel = (level?: number): string => {
  if (!level) return "Not rated"
  if (level <= 1) return "Beginner"
  if (level <= 2) return "Basic"
  if (level <= 3) return "Intermediate"
  if (level <= 4) return "Advanced"
  return "Expert"
}
