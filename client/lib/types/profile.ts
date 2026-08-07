export type UserRole = "Student" | "Alumni";

export type SkillLevel =
  | "Beginner"
  | "Basic"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export interface Skill {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  level?: SkillLevel | number;
  description?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Mentor {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar: string;
}

export interface Certification {
  id: string;
  name?: string;
  title?: string;
  issuer: string;
  fileUrl?: string;
  issueDate?: string;
}

export interface Profile {
  id: string;
  userId: string;
  profilePicture: string;
  yearLevel: string;
  fullName: string;
  work_field: string;
  socialLink: string;
  companyName: string;
  aboutMe: string;
  current_position: string;
  graduatedYear: string;
  createdAt: string;
  updatedAt: string;
  skills: Skill[];
  certifications: Certification[];
}

export interface ViewProfileResponse {
  status: string;
  code: number;
  message: string;
  profile: Profile;
}