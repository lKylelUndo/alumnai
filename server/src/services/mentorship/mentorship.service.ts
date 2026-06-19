import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { SendMentorshipInviteTypes } from "@/schema/mentorship";

export class MentorshipService {
    private mentorshipRepository = new MentorshipRepository();

    public acceptMentorship = async () => {};

    public declineMentorship = async () => {};

    public viewAllMentorshipInvites = async () => {};

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
