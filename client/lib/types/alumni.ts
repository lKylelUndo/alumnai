import { AlumniStudentMentorshipCardTypes } from "./mentorship";
import { AlumniStudentCollaborationCardTypes } from "./collaboration";

export type {
  AlumniStudentMentorshipCardTypes,
  AlumniStudentCollaborationCardTypes,
};

export type AlumniRequest = {
  studentId: string
  name: string
  status?:
    | "pending"
    | "processing"
    | "success"
    | "approved"
    | "rejected"
    | "failed"
  email: string
  documents: string
}
