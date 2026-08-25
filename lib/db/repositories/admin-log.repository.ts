import { BaseRepository } from "@/lib/db/repositories/base.repository";

export type AdminLogEvent = "login" | "logout" | "admin_access_granted" | "admin_access_revoked";

export type AdminLogDocument = {
  event: AdminLogEvent;
  adminId?: string;
  email?: string;
  provider?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
};

class AdminLogRepository extends BaseRepository<AdminLogDocument> {
  protected readonly collectionName = "adminLogs";

  async record(entry: AdminLogDocument): Promise<void> {
    await this.insertOne(entry);
  }
}

export const adminLogRepository = new AdminLogRepository();
