import { UserRole, RecognitionItem } from "./auth";
import { Skill, SkillLevel, SkillCategory } from "./skill";

export type { UserRole, SkillLevel, SkillCategory, Skill };

export interface Certification {
  id: string;
  profileId?: string;
  name?: string;
  title?: string;
  issuer: string;
  fileUrl?: string;
  issueDate?: string;
  createdAt?: string;
  updatedAt?: string;
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
  user?: {
    id: string;
    email?: string | null;
    student_id_number?: string | null;
    role?: "STUDENT" | "ALUMNI" | "ADMIN" | string;
    receivedRecognitions?: RecognitionItem[];
  };
}

export interface ViewProfileResponse {
  status: string;
  code: number;
  message: string;
  profile: Profile;
}