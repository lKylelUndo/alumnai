export type AlumniStudentMentorshipCardTypes = {
  fromStudentId: string
  mentorshipRecordId: string
  fullName: string
  track: string 
  yearLevel: string
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string
  message: string
}

export type AlumniStudentCollaborationCardTypes = {
  fromStudentId: string
  collaborationId: string 
  fullName: string
  track: string 
  yearLevel: string 
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string 
}