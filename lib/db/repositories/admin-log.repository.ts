import { ObjectId } from "mongodb";

import { BaseRepository } from "@/lib/db/repositories/base.repository";
import { getDatabase } from "@/lib/db/config";

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

export type SessionLogItem = {
  id: string;
  email: string;
  ip?: string;
  device: string;
  userAgent?: string;
  loginAt: Date;
  logoutAt?: Date;
  isActive: boolean;
};

export type AdminSessionLogDocument = {
  sessionId: string;
  adminId: string;
  email: string;
  ip?: string;
  device: string;
  userAgent?: string;
  loginAt: Date;
  logoutAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type BetterAuthSessionDocument = {
  _id: ObjectId;
  userId: ObjectId | string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt?: Date;
};

type BetterAuthUserDocument = {
  _id: ObjectId;
  email: string;
};

function deviceFromUserAgent(userAgent?: string): string {
  if (!userAgent) return "Unknown device";
  const platform = /iPhone|iPad|iPod/i.test(userAgent)
    ? "iOS"
    : /Android/i.test(userAgent)
      ? "Android"
      : /Mac OS X/i.test(userAgent)
        ? "macOS"
        : /Windows/i.test(userAgent)
          ? "Windows"
          : /Linux/i.test(userAgent)
            ? "Linux"
            : "Unknown OS";
  const browser = /Edg\//i.test(userAgent)
    ? "Edge"
    : /Chrome\//i.test(userAgent)
      ? "Chrome"
      : /Firefox\//i.test(userAgent)
        ? "Firefox"
        : /Safari\//i.test(userAgent)
          ? "Safari"
          : "Browser";
  return `${platform} · ${browser}`;
}

class AdminLogRepository extends BaseRepository<AdminLogDocument> {
  protected readonly collectionName = "adminLogs";

  async record(entry: AdminLogDocument): Promise<void> {
    await this.insertOne(entry);
  }

  async listPage(page: number, limit = 30) {
    const safePage = Math.max(1, page);
    const [items, total] = await Promise.all([
      this.collection()
        .find({})
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * limit)
        .limit(limit)
        .toArray(),
      this.collection().countDocuments(),
    ]);
    return { items, total, page: safePage, limit };
  }

  async recordSessionLogin(input: Omit<AdminSessionLogDocument, "logoutAt" | "isActive" | "createdAt" | "updatedAt">): Promise<void> {
    const now = new Date();
    await getDatabase().collection<AdminSessionLogDocument>("adminLogs").updateOne(
      { sessionId: input.sessionId },
      { $set: { ...input, isActive: true, loginAt: input.loginAt, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
  }

  async recordSessionLogout(input: {
    sessionId: string;
    adminId: string;
    email: string;
    loginAt?: Date;
  }): Promise<void> {
    const now = new Date();
    await getDatabase().collection<AdminSessionLogDocument>("adminLogs").updateOne(
      { sessionId: input.sessionId },
      {
        $set: { isActive: false, logoutAt: now, updatedAt: now },
        $setOnInsert: {
          sessionId: input.sessionId,
          adminId: input.adminId,
          email: input.email,
          device: "Unknown device",
          loginAt: input.loginAt ?? now,
          createdAt: now,
        },
      },
      { upsert: true }
    );
  }

  async syncActiveSessions(): Promise<void> {
    const database = getDatabase();
    const now = new Date();
    const sessions = await database
      .collection<BetterAuthSessionDocument>("session")
      .find({ expiresAt: { $gt: now } })
      .toArray();
    if (!sessions.length) return;

    const userIds = sessions.flatMap((session) => {
      const id = String(session.userId);
      return ObjectId.isValid(id) ? [new ObjectId(id)] : [];
    });
    const users = await database
      .collection<BetterAuthUserDocument>("user")
      .find({ _id: { $in: userIds } })
      .toArray();
    const emailsByUserId = new Map(users.map((user) => [user._id.toString(), user.email]));
    const records = sessions.flatMap((session) => {
      const adminId = String(session.userId);
      const email = emailsByUserId.get(adminId);
      if (!email) return [];
      return [{
        sessionId: session._id.toString(),
        adminId,
        email,
        ip: session.ipAddress,
        userAgent: session.userAgent,
        device: deviceFromUserAgent(session.userAgent),
        loginAt: session.createdAt,
      }];
    });
    await Promise.all(records.map((record) => this.recordSessionLogin(record)));
  }

  async recordAdminSessionsLogout(adminId: string): Promise<void> {
    const now = new Date();
    await getDatabase().collection<AdminSessionLogDocument>("adminLogs").updateMany(
      { adminId, isActive: true },
      { $set: { isActive: false, logoutAt: now, updatedAt: now } }
    );
  }

  async listSessionsPage(page: number, limit = 30): Promise<{
    items: SessionLogItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    await this.syncActiveSessions();
    const safePage = Math.max(1, page);
    const sessions = getDatabase().collection<AdminSessionLogDocument>("adminLogs");
    const [items, total] = await Promise.all([
      sessions
        .find({ loginAt: { $exists: true } })
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * limit)
        .limit(limit)
        .toArray(),
      sessions.countDocuments({ loginAt: { $exists: true } }),
    ]);
    return {
      items: items.map((entry) => ({
        id: entry._id.toString(),
        email: entry.email,
        ip: entry.ip,
        device: entry.device,
        userAgent: entry.userAgent,
        loginAt: entry.loginAt,
        logoutAt: entry.logoutAt,
        isActive: entry.isActive,
      })),
      total,
      page: safePage,
      limit,
    };
  }
}

export const adminLogRepository = new AdminLogRepository();
