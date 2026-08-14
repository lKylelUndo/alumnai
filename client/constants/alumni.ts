export type AlumniStudentCardTypes = {
  fromStudentId: string
  mentorshipRecord: string
  fullName: string
  track: string | null
  yearLevel: string | null
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string | null
  message: string
}