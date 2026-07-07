export type UserRole = "Student" | "Alumni";

export type SkillLevel =
  | "Beginner"
  | "Basic"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
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
  title: string;
  issuer: string;
}

export interface Profile {
  id: string;
  role: UserRole;

  name: string;
  studentId: string;
  email: string;
  github: string;
  avatar: string;

  about: string;

  skills: SkillCategory[];

  mentors: Mentor[];

  certifications: Certification[];
}