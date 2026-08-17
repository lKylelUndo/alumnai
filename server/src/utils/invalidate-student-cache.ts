import { ENV } from "@/config/env";
import { redis } from "@/lib/redis";

export async function invalidateStudentDashboardCache(studentUserId: string) {
  await Promise.all([
    redis.del(`${ENV.STUDENT_REDIS_KEY}student-dashboard-stats-${studentUserId}`),
    redis.del(`${ENV.STUDENT_REDIS_KEY}mentors-${studentUserId}`),
    redis.del(`${ENV.STUDENT_REDIS_KEY}collaborations-${studentUserId}`),
    redis.del(`${ENV.STUDENT_REDIS_KEY}collab-requests-${studentUserId}`),
    redis.del(`${ENV.STUDENT_REDIS_KEY}find-mentors-${studentUserId}`),
  ]);
}
