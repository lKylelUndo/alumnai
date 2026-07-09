import { prisma } from "@/lib/prisma";

export const GetMeService = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profile: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
            yearLevel: true,
            work_field: true,
            companyName: true,
            socialLinks: true,
            current_position: true,
            certifications: true
          }
        },
        student_id_number: true,
        email: true,
        role: true,
        isAccountVerified: true
      },
    });

    if (!user) 
      return { code: 404, status: "error",message: "User not found" };
    
    return { code: 200, status: "success", data: {user} };
  } catch (error) {
    console.error(error);
    return { code: 500, status: "error", message: "GetMeServiceError", error };
  }
}
