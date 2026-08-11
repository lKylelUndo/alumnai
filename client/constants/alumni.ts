export type AlumniStudentCardTypes = {
  data: {
    id: string
    recordId: string
    name: string
    track: string
    year: string
    status: string
    profilePicture?: string | null
    message?: string
  }
} | null
