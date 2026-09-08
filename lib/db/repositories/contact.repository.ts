import type { WithId } from "mongodb";

import { BaseRepository } from "@/lib/db/repositories/base.repository";
import type {
  ContactContent,
  ContactSections,
  ContactSubmission,
  ContactSubmissionStatus,
} from "@/lib/types/contact";

function defaults(): ContactContent {
  const now = new Date();
  return {
    key: "contact",
    createdAt: now,
    updatedAt: now,
    seo: {
      title: "Contact TU Media",
      description: "Start a conversation about your next technology launch.",
    },
    hero: {
      eyebrow: "Brand & business enquiries",
      title: "Let's make your next launch worth talking about.",
      emphasis: "talking about.",
      description:
        "Tell us what you are building, who it is for, and where you want to go next. We will start with the useful questions.",
      notes: ["Product strategy", "Creator partnerships", "Campaign clarity"].map(
        (text, order) => ({ id: `contact-note-${order + 1}`, text, order })
      ),
    },
    conversation: {
      eyebrow: "Start a conversation",
      title: "What can we help your product do next?",
      emphasis: "do next?",
      description:
        "Share as much context as you can. We use it to prepare for a more useful first conversation—not to make assumptions about your campaign.",
      creatorPrompt: "Looking to join as a creator?",
      creatorLinkLabel: "Visit the creator application",
    },
    nextSteps: {
      eyebrow: "What happens next",
      title: "A better starting point leads to a better brief.",
      emphasis: "brief.",
      description:
        "No generic discovery call. We use what you share to make the first conversation earn its place on your calendar.",
      steps: [
        ["We review the context", "We look at your product, audience, objectives, and timing so the next conversation begins with the right context."],
        ["We start with the useful questions", "If there is a potential fit, we use your enquiry to guide a focused conversation about priorities and possibilities."],
        ["We shape the right next step", "From there, we decide whether a creator-marketing programme, a specific campaign, or another route makes sense."],
      ].map(([title, copy], order) => ({ id: `contact-step-${order + 1}`, title, copy, order })),
    },
    info: { phone: "", email: "", address: "", socialLinks: [] },
  };
}

class ContactRepository extends BaseRepository<ContactContent> {
  protected readonly collectionName = "contactContent";

  async get(): Promise<WithId<ContactContent>> {
    const current = await this.findOne({ key: "contact" });
    if (!current) return this.insertOne(defaults());
    const fallback = defaults();
    return {
      ...fallback,
      ...current,
      hero: { ...fallback.hero, ...current.hero },
      conversation: { ...fallback.conversation, ...current.conversation },
      nextSteps: { ...fallback.nextSteps, ...current.nextSteps },
      info: { ...fallback.info, ...current.info },
    };
  }

  async updateSection<TKey extends keyof ContactSections>(
    section: TKey,
    data: ContactSections[TKey],
    updatedBy: string
  ) {
    return this.updateOne(
      { key: "contact" },
      { $set: { [section]: data, updatedAt: new Date(), updatedBy } }
    );
  }
}

class ContactSubmissionRepository extends BaseRepository<ContactSubmission> {
  protected readonly collectionName = "contactSubmissions";

  async create(data: Omit<ContactSubmission, "status" | "createdAt" | "updatedAt">) {
    const now = new Date();
    return this.insertOne({ ...data, status: "unread", createdAt: now, updatedAt: now });
  }

  async list({ page, limit, search, status, sort = "newest" }: { page: number; limit: number; search?: string; status?: ContactSubmissionStatus; sort?: "newest" | "oldest" }) {
    const filter: Record<string, unknown> = {};
    if (status === "read" || status === "unread") filter.status = status;
    if (search?.trim()) {
      const expression = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ fullName: expression }, { email: expression }, { company: expression }];
    }
    const collection = this.collection();
    const [items, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: sort === "oldest" ? 1 : -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);
    return { items, total };
  }

  async listAll() {
    return this.collection().find({}).sort({ createdAt: 1 }).toArray();
  }

  async getById(id: string) {
    const { ObjectId } = await import("mongodb");
    if (!ObjectId.isValid(id)) return null;
    return this.findOne({ _id: new ObjectId(id) } as never);
  }

  async markRead(id: string) {
    const { ObjectId } = await import("mongodb");
    if (!ObjectId.isValid(id)) return null;
    return this.updateOne({ _id: new ObjectId(id) } as never, { $set: { status: "read", updatedAt: new Date() } });
  }

  async deleteMany(ids: string[]) {
    const { ObjectId } = await import("mongodb");
    const objectIds = ids.filter(ObjectId.isValid).map((id) => new ObjectId(id));
    if (objectIds.length) await this.collection().deleteMany({ _id: { $in: objectIds } });
  }
}

export const contactRepository = new ContactRepository();
export const contactSubmissionRepository = new ContactSubmissionRepository();
