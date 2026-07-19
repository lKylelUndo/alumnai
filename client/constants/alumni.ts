// ─── Types ────────────────────────────────────────────────────────────────────

export type YearLevel = "1ST YEAR" | "2ND YEAR" | "3RD YEAR" | "4TH YEAR"
export type MenteeStatus = "Active" | "Pending" | "Completed"

export type Mentee = {
  id: string
  name: string
  track: string
  year: YearLevel
  status: MenteeStatus
  profilePicture?: string | null
}

export type Collaboration = {
  id: string
  name: string
  track: string
  year: YearLevel
  status: MenteeStatus
  profilePicture?: string | null
}

export type MentorshipRequest = {
  id: string
  name: string
  track: string
  year: YearLevel
  status: MenteeStatus
  profilePicture?: string | null
}

// ─── Static Data ──────────────────────────────────────────────────────────────

export const dummyMentees: Mentee[] = [
  {
    id: "1",
    name: "Marvin Barro",
    track: "FRONTEND",
    year: "3RD YEAR",
    status: "Active",
    profilePicture: null,
  },
  {
    id: "2",
    name: "Shin Aro",
    track: "FRONTEND",
    year: "3RD YEAR",
    status: "Active",
    profilePicture: null,
  },
]

export const dummyCollaborations: Collaboration[] = [
  {
    id: "1",
    name: "Smith Degamo",
    track: "FRONTEND",
    year: "3RD YEAR",
    status: "Active",
    profilePicture: null,
  },
  {
    id: "2",
    name: "Paul Asi",
    track: "FRONTEND",
    year: "3RD YEAR",
    status: "Active",
    profilePicture: null,
  },
]

export const dummyMentorshipRequests: MentorshipRequest[] = [
  {
    id: "1",
    name: "Kyle Ando",
    track: "FULL-STACK",
    year: "3RD YEAR",
    status: "Pending",
    profilePicture: null,
  },
  {
    id: "2",
    name: "Ismael Codilla",
    track: "FULL-STACK",
    year: "3RD YEAR",
    status: "Pending",
    profilePicture: null,
  },
]
