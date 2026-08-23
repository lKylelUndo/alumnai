import { ENV } from "@/config/env";
import { redis } from "@/lib/redis";

export async function invalidateAdminDashboardCache() {
    await Promise.all([
        redis.del(`${ENV.ADMIN_REDIS_KEY}dashboard-stats`),
        redis.del(`${ENV.ADMIN_REDIS_KEY}all-users`),
        redis.del(`${ENV.ADMIN_REDIS_KEY}unverified-users`),
        redis.del(`${ENV.ADMIN_REDIS_KEY}top-mentors`),
        redis.del(`${ENV.ADMIN_REDIS_KEY}top-alumni-skills`),
    ]);
}
