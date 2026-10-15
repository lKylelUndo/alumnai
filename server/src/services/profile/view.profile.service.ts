import { RoleType } from "@/generated/prisma/enums";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { ProfileRepository } from "@/repositories/profile.repository";

/**
 * One active relationship row attached to a viewed profile.
 *
 * Privacy: this payload also reaches non-admin viewers, so it only ever
 * carries fields that are already safe to show — never message,
 * message_details, emails, student_id_number, or recognition bodies.
 */
export type ProfileRelationRow = {
  id: string;
  fullName: string;
  profilePicture: string | null;
  subtitle: string | null;
};

// Role of the user whose profile is being viewed. Already part of the
// profile payload (findById selects user.role), so no extra user query.
type ViewedProfile = {
  user?: { role?: string | null } | null;
};

// Source rows produced by the existing repositories (their results are
// JSON-parsed out of redis, so every field is read defensively).
type MentorSourceRow = {
  toAlumniId: string;
  fullName: string;
  profilePicture: string | null;
  currentPosition: string | null;
  companyName: string | null;
};

type StudentSourceRow = {
  fromStudentId: string;
  fullName: string;
  profilePicture: string | null;
  yearLevel: string;
  track: string;
};

type CollaboratorSourceRow = {
  fromAlumniId: string;
  fullName: string;
  profilePicture: string | null;
  currentPosition: string | null;
  companyName: string | null;
};

// formatStudentCard placeholders — "N/A"/"GENERAL" say nothing about a person.
const PLACEHOLDER_SUBTITLES = new Set(["N/A", "GENERAL"]);

const mapMentorRow = (row: MentorSourceRow): ProfileRelationRow => ({
  id: row.toAlumniId,
  fullName: row.fullName,
  profilePicture: row.profilePicture ?? null,
  subtitle:
    row.currentPosition && row.companyName
      ? `${row.currentPosition} @ ${row.companyName}`
      : row.currentPosition || row.companyName || null,
});

const mapStudentRow = (row: StudentSourceRow): ProfileRelationRow => ({
  id: row.fromStudentId,
  fullName: row.fullName,
  profilePicture: row.profilePicture ?? null,
  subtitle:
    [row.yearLevel, row.track]
      .filter((part) => Boolean(part) && !PLACEHOLDER_SUBTITLES.has(part))
      .join(" • ") || null,
});

const mapCollaboratorRow = (row: CollaboratorSourceRow): ProfileRelationRow => ({
  id: row.fromAlumniId,
  fullName: row.fullName,
  profilePicture: row.profilePicture ?? null,
  subtitle:
    row.currentPosition && row.companyName
      ? `${row.currentPosition} @ ${row.companyName}`
      : row.currentPosition || row.companyName || null,
});

/**
 * Relationship lists are best-effort extras on a profile read: a failure in
 * one of them must never turn a successful profile view into an error, so
 * each list degrades to [] instead (logged with the service-name prefix).
 */
const fetchRelationList = async <T>(
  label: string,
  fetchRows: () => Promise<unknown>,
  mapRow: (row: T) => ProfileRelationRow,
): Promise<ProfileRelationRow[]> => {
  try {
    const rows = await fetchRows();
    return Array.isArray(rows) ? rows.map(mapRow) : [];
  } catch (error) {
    console.error("ViewProfileService", `${label} fetch failed:`, error);
    return [];
  }
};

export const ViewProfileService = async (profileId: string, userIdWhoRequested: string) => {
  const profileRepository = new ProfileRepository();
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const collaborationRepository = new CollaborationRepository();

  try {
    const profile = await profileRepository.findById(profileId, userIdWhoRequested);

    if (!profile)
      return { status: "error", code: 404, message: "Profile not found" };

    const viewedProfile: ViewedProfile = profile;
    const viewedRole = viewedProfile.user?.role ?? null;

    // Gating: a student has mentors and collaborations, an alumni has
    // mentees and collaborations — everything else stays [] without
    // touching the repos.
    const mentors: ProfileRelationRow[] =
      viewedRole === RoleType.STUDENT
        ? await fetchRelationList("mentors", () =>
            mentorshipRepository.getActiveMentors(profileId), mapMentorRow)
        : [];

    const mentees: ProfileRelationRow[] =
      viewedRole === RoleType.ALUMNI
        ? await fetchRelationList("mentees", () =>
            alumniRepository.getActiveMentees(profileId), mapStudentRow)
        : [];

    const collaborations: ProfileRelationRow[] =
      viewedRole === RoleType.ALUMNI
        ? await fetchRelationList("collaborations", () =>
            alumniRepository.getActiveCollaborations(profileId), mapStudentRow)
        : viewedRole === RoleType.STUDENT
          ? await fetchRelationList("collaborations", () =>
              collaborationRepository.getActiveCollaborations(profileId), mapCollaboratorRow)
          : [];

    return {
      status: "success",
      code: 200,
      message: "Successfully view a single profile",
      profile,
      mentors,
      mentees,
      collaborations,
    };
  } catch (error) {
    console.error("ViewProfileService", error);
    return { status: "error", code: 500, message: "Unable to view a profile" };
  }
};
