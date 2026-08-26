import { StudentMentorCardTypes } from "./mentorship";
import {
  StudentCollaboratorCardTypes,
  StudentCollabInviteCardTypes,
} from "./collaboration";

export type {
  StudentMentorCardTypes,
  StudentCollaboratorCardTypes,
  StudentCollabInviteCardTypes,
};

// Shape returned by the AI smart search endpoint
export type RecommendedStudent = {
  id: string
  name: string
  bio: string
  profilePicture?: string | null
  skills: {
    name: string
    level: number
    description: string
    match: boolean
  }[]
  score: number
  contextScore?: number
  reason: string
}
