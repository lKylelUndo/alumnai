import { prisma } from "@/lib/prisma";

export class ProfileRepository {
    async all() {
        return await prisma.profile.findMany();
    }
}