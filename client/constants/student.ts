export type StudentMentorCardTypes = {
  toAlumniId: string
  mentorshipRecordId: string
  fullName: string
  workField: string
  companyName: string | null
  currentPosition: string | null
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string | null
  message: string
  recognition?: {
    id: string
    message: string
    createdAt: string
    updatedAt: string
  } | null
}

export type StudentCollaboratorCardTypes = {
  fromAlumniId: string
  collaborationId: string
  fullName: string
  workField: string
  companyName: string | null
  currentPosition: string | null
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string | null
  message: string
}

export type StudentCollabInviteCardTypes = {
  fromAlumniId: string
  collaborationId: string
  fullName: string
  workField: string
  companyName: string | null
  currentPosition: string | null
  status: "ACTIVE" | "INACTIVE" | "PENDING"
  profilePicture: string | null
  message: string
}
