import { ProfileService } from "@/services/profile/profile.service";
import type { Request, Response } from "express";

class ProfileController {
    private profileService = new ProfileService();

    public updateProfile = async (req: Request, res: Response) => {
        const { profilePicture, yearLevel, fullName, work_field, socialLinks, companyName, current_position, certifications } = req.body ?? {}
        return res.json("Test");
    }

    public viewProfile = async (req: Request, res: Response) => {
        const { id } = req.body ?? {};
        const response = await this.profileService.viewProfile(id);
        return res.status(response.code).json(response);
    }

    public allProfiles = async (req: Request, res: Response) => {
        const response = await this.profileService.allProfiles();
        return res.status(response.code).json(response);
    }
 
}

export default new ProfileController();