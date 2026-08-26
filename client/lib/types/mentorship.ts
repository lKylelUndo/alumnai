import { RecognitionItem } from "./auth";

export type { RecognitionItem };

export interface Mentor {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar: string;
}

export type StudentMentorCardTypes = {
  toAlumniId: string;
  mentorshipRecordId: string;
  fullName: string;
  workField: string;
  companyName: string | null;
  currentPosition: string | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  profilePicture: string | null;
  message: string;
  recognition?: RecognitionItem | null;
};

export type AlumniStudentMentorshipCardTypes = {
  fromStudentId: string;
  mentorshipRecordId: string;
  fullName: string;
  track: string;
  yearLevel: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  profilePicture: string;
  message: string;
};

export type TopMentors = {
  ranking: string | number
  name: string
  mentees: string | number
}