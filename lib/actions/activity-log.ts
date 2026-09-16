import { cmsActivityRepository } from "@/lib/db/repositories/cms-activity.repository";

export function recordCmsActivity(actor: { id: string; email: string }, action: string, target: string) {
  return cmsActivityRepository.record({
    adminId: actor.id,
    email: actor.email,
    performer: "name" in actor && typeof actor.name === "string" && actor.name.trim() ? actor.name : actor.email,
    action,
    target,
  });
}
