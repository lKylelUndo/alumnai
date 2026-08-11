import { ENV } from "@/config/env"
import { redis } from "@/lib/redis"

export async function invalidateAlumniDashboardCache(alumniUserId: string) {
  await Promise.all([
    redis.del(`${ENV.ALUMNI_REDIS_KEY}dashboard-stats-${alumniUserId}`),
    redis.del(`${ENV.ALUMNI_REDIS_KEY}mentees-${alumniUserId}`),
    redis.del(`${ENV.ALUMNI_REDIS_KEY}collaborations-${alumniUserId}`),
    redis.del(`${ENV.ALUMNI_REDIS_KEY}mentorship-requests-${alumniUserId}`),
  ])
}
