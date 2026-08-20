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
  canonicalSkillId?: string | null;
  profileId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}
