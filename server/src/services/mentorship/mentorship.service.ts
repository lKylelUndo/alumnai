import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { SendMentorshipInviteTypes } from "@/schema/mentorship";

export class MentorshipService {
    private mentorshipRepository = new MentorshipRepository();

    public acceptMentorship = async () => {};

    public declineMentorship = async () => {};

    public viewAllMentorshipInvites = async (userId: string) => {
        try {
            const invites = await this.mentorshipRepository.getAllInvites(userId);
            return { status: "success", code: 200, invites }
        } catch (error) {
            console.error("ViewAllMentorshipInvitesService", error);
            return { status: "error", code: 500, message: "Unable to view all mentorship invites" }
        }
    };

    public sendMentorshipInvite = async (userId: string, data: SendMentorshipInviteTypes) => {
        try {
            const alreadyInvited = await this.mentorshipRepository.findIfInviteExisted(userId, data.toAlumniId)
            
            if (alreadyInvited) 
                return { status: "error", code: 400, message: "Already sent a mentorship invite" };
            
            const response = await this.mentorshipRepository.send(userId, data);

            if(!response) 
                return { status: "error", code: 400, message: "Failed to send mentorship invite" };
            
            return { status: "success", code: 200, message: "Successfully send mentorship invite" };
        } catch (error) {
            console.error("SendMentorshipInviteService", error);
            return { status: "error", code: 500, message: "Unable to send mentorship invite" };
        }
    };
}
