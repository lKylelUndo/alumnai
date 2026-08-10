import { ViewProfileService, UpdateProfileService, AllProfilesService } from "@/services/profile";
import type { Request, Response } from "express";

class ProfileController {
    public updateProfile = async (req: Request, res: Response) => {
        const { userId, profilePicture, yearLevel, fullName, aboutMe, work_field, socialLink, companyName, current_position, graduatedYear, certifications } = req.body ?? {}
        const response = await UpdateProfileService({ userId, profilePicture, yearLevel, fullName, aboutMe, work_field, socialLink, companyName, current_position, graduatedYear, certifications })
        return res.status(response.code).json(response);
    }

    public viewProfile = async (req: Request, res: Response) => {
        const { id: profileId } = req.body ?? {};
        const { userId: userIdWhoRequested } = (req as any).user;

        const response = await ViewProfileService(profileId, userIdWhoRequested);
        return res.status(response.code).json(response);
    }

    public allProfiles = async (req: Request, res: Response) => {
        const response = await AllProfilesService();
        return res.status(response.code).json(response);
    }
 
}

export default new ProfileController();
