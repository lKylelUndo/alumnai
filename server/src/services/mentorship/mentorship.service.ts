import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { SendMentorshipInviteTypes } from "@/schema/mentorship";

export class MentorshipService {
    private mentorshipRepository = new MentorshipRepository();

    public acceptMentorship = async (mentorshipId: string) => {
        try {
            const response = await this.mentorshipRepository.accept(mentorshipId)

            if (!response)
                return { status: "error", code: 400, message: "Failed to accept mentorship invite" };

            return { status: "success", code: 200, message: "Successfully accept a mentorship" }; 
        } catch (error) {
            console.error("AcceptMentorshipService", error);
            return { status: "error", code: 500, message: "Unable to accept a mentorship" }; 
        }
    };

    public declineMentorship = async (mentorshipId: string) => {
        try {
            const response = await this.mentorshipRepository.decline(mentorshipId)

            if (!response)
                return { status: "error", code: 400, message: "Failed to decline mentorship invite" };

            return { status: "success", code: 200, message: "Successfully decline a mentorship invite" }; 
        } catch (error) {
            console.error("DeclineMentorshipService", error);
            return { status: "error", code: 500, message: "Unable to decline a mentorship" }; 
        }
    };

    public viewAllMentorshipInvites = async (userId: string) => {
        try {
            const invites = await this.mentorshipRepository.getAllInvites(userId);
            
            if (Object.keys(invites).length === 0) 
                return { status: "error", code: 400, message: "There are no mentorship invites at the moment" };

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

    public endMentorship = async (mentorshipId: string) => {
        try {
            const response = await this.mentorshipRepository.end(mentorshipId);

            if (!response) 
                return { status: "error", code: 400, message: "Failed to end mentorship"};

            return { status: "success", code: 200, message: "Successfully end mentorship"};
        } catch (error) {
            console.error("EndMentorshipService", error);
            return { status: "error", code: 500, message: "Unable to end mentorship"}
        }
    }
}
