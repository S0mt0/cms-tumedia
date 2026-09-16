import { BaseRepository } from "@/lib/db/repositories/base.repository";

export type CmsActivityLog = {
  adminId: string;
  email: string;
  action: string;
  target: string;
  createdAt: Date;
};

class CmsActivityRepository extends BaseRepository<CmsActivityLog> {
  protected readonly collectionName = "cmsActivityLogs";

  async record(input: Omit<CmsActivityLog, "createdAt">): Promise<void> {
    await this.insertOne({ ...input, createdAt: new Date() });
  }

  async listPage(page: number, limit = 30) {
    const safePage = Math.max(1, page);
    const [items, total] = await Promise.all([
      this.collection().find({}).sort({ createdAt: -1 }).skip((safePage - 1) * limit).limit(limit).toArray(),
      this.collection().countDocuments(),
    ]);
    return { items, total, page: safePage, limit };
  }
}

export const cmsActivityRepository = new CmsActivityRepository();
