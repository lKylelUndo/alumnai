export type AlumniStudentCardTypes = {
  id: string
  recordId: string
  fullName: string | null
  work_field: string | null
  yearLevel: string | null
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string | null
  message: string
}