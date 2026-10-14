import { Skill } from "@/schema/skill";

export type UserRole = "Student" | "Alumni" | "STUDENT" | "ALUMNI" | "ADMIN";

export interface User {
  id: string;
  email: string | null;
  student_id_number: string | null;
  role: string;
  isAccountVerified: boolean;
  profile?: {
    id?: string;
    userId?: string;
    profilePicture?: string | null;
    aboutMe?: string | null;
    yearLevel?: string | null;
    graduatedYear?: string | null;
    fullName?: string | null;
    work_field?: string | null;
    companyName?: string | null;
    socialLink?: string;
    current_position?: string | null;
    isAvailableForMentorship?: boolean | null;
    isAvailableForCollaboration?: boolean | null;
    certifications?: Array<{
      id: string;
      profileId: string;
      name: string;
      issuer: string;
      fileUrl: string;
      isVisible?: boolean;
    }>;
    skills?: Skill[];
  } | null;
  receivedRecognitions?: Array<{
    id: string;
    fromStudentId: string;
    toAlumniId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    fromStudent?: {
      id: string;
      profile?: {
        fullName?: string | null;
        profilePicture?: string | null;
        work_field?: string | null;
      } | null;
    } | null;
  }>;
}

export interface RecognitionItem {
  id: string;
  fromStudentId?: string;
  toAlumniId?: string;
  message: string;
  isVisible?: boolean;
  createdAt: string;
  updatedAt?: string;
  fromStudent?: {
    id: string;
    profile?: {
      fullName?: string | null;
      profilePicture?: string | null;
      work_field?: string | null;
    } | null;
  } | null;
}
