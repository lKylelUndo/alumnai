export type StudentCollaboratorCardTypes = {
  fromAlumniId: string;
  collaborationId: string;
  fullName: string;
  workField: string;
  companyName: string | null;
  currentPosition: string | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  profilePicture: string | null;
  message: string;
};

export type StudentCollabInviteCardTypes = {
  fromAlumniId: string;
  collaborationId: string;
  fullName: string;
  workField: string;
  companyName: string | null;
  currentPosition: string | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  profilePicture: string | null;
  message: string;
};

export type AlumniStudentCollaborationCardTypes = {
  fromStudentId: string;
  collaborationId: string;
  fullName: string;
  track: string;
  yearLevel: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  profilePicture: string;
};
