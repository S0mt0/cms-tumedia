import { cmsActivityRepository } from "@/lib/db/repositories/cms-activity.repository";

export function recordCmsActivity(actor: { id: string; email: string }, action: string, target: string) {
  return cmsActivityRepository.record({ adminId: actor.id, email: actor.email, action, target });
}
