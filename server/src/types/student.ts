export type RecommendedStudentTypes = {
  id: string;
  name: string;
  skills: Array<{ name: string; level: number; description: string; match?: boolean }>;
  bio: string;
};
