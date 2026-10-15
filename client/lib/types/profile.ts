import { RecognitionItem } from "./auth";
import { Skill } from "./skill";

export interface Certification {
  id: string;
  profileId?: string;
  name?: string;
  title?: string;
  issuer: string;
  fileUrl?: string;
  isVisible?: boolean;
  issueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileRelationRow {
  id: string;
  fullName: string;
  profilePicture: string | null;
  subtitle: string | null;
}

export interface PendingCollaborationInvite {
  collaborationId: string;
  fromAlumniId: string;
  message: string;
  status: string;
}

export interface Profile {
  id: string;
  userId: string;
  profilePicture: string;
  yearLevel: string;
  fullName: string;
  work_field: string;
  isAvailableForMentorship?: boolean | null;
  isAvailableForCollaboration?: boolean | null;
  socialLink: string;
  companyName: string;
  aboutMe: string;
  current_position: string;
  graduatedYear: string;
  createdAt: string;
  updatedAt: string;
  skills: Skill[];
  certifications: Certification[];
  mentorshipStatus?: "PENDING" | "ACTIVE" | null;
  pendingCollaborationInvite?: PendingCollaborationInvite | null;
  mentors?: ProfileRelationRow[];
  mentees?: ProfileRelationRow[];
  collaborations?: ProfileRelationRow[];
  user?: {
    id: string;
    email?: string | null;
    student_id_number?: string | null;
    role?: "STUDENT" | "ALUMNI" | "ADMIN" | string;
    receivedRecognitions?: RecognitionItem[];
  };
}