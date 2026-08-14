import { AlumniRepository } from "@/repositories/alumni.repository";

export async function AcceptMentorshipRequestService(userId: string, mentorshipRecordId: string) {
    const alumniRepository = new AlumniRepository();
    try {
        
        return { status: "success", message: "Successfully accepted mentorship request", code: 200 };
    } catch (error) {
        console.error("AcceptMentorshipRequestService", error);
        return { status: "error", message: "Failed to accept mentorship request", code: 500 };
    }
}