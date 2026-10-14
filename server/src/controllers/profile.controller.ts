import { ViewProfileService, UpdateProfileService, AllProfilesService, SetCertificationVisibilityService, DeleteCertificationService } from "@/services/profile";
import type { Request, Response } from "express";

class ProfileController {
    public updateProfile = async (req: Request, res: Response) => {
        // SECURITY: userId always comes from the verified token, never the body.
        // A body-supplied userId is ignored so users can't edit other profiles.
        const userId = req.user!.userId;
        const { profilePicture, yearLevel, fullName, aboutMe, work_field, socialLink, companyName, current_position, graduatedYear, certifications, isAvailableForMentorship, isAvailableForCollaboration } = req.body ?? {}
        const response = await UpdateProfileService({ userId, profilePicture, yearLevel, fullName, aboutMe, work_field, socialLink, companyName, current_position, graduatedYear, certifications, isAvailableForMentorship, isAvailableForCollaboration })
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

    public setCertificationVisibility = async (req: Request, res: Response) => {
        // SECURITY: userId always comes from the verified token, never the body.
        const userId = req.user!.userId;
        const { id: certificationId } = req.params;
        if (typeof certificationId !== "string") {
          return res
            .status(400)
            .json({ status: "error", code: 400, message: "Certification id is required" });
        }
        // Body shape already enforced by setCertificationVisibilitySchema.
        const { isVisible } = req.body ?? {};
        const response = await SetCertificationVisibilityService(certificationId, userId, isVisible);
        return res.status(response.code).json(response);
    }

    public deleteCertification = async (req: Request, res: Response) => {
        // SECURITY: userId always comes from the verified token, never the body.
        const userId = req.user!.userId;
        const { id: certificationId } = req.params;
        if (typeof certificationId !== "string") {
          return res
            .status(400)
            .json({ status: "error", code: 400, message: "Certification id is required" });
        }
        const response = await DeleteCertificationService(certificationId, userId);
        return res.status(response.code).json(response);
    }
 
}

export default new ProfileController();
