import "dotenv/config";

import { getMongoClient, getDatabase } from "@/lib/db/config";

const documents = [
  ["landingContent", "landing"],
  ["aboutContent", "about"],
  ["contactContent", "contact"],
  ["joinContent", "join"],
  ["blogContent", "blogs"],
  ["industriesContent", "industries"],
  ["workContent", "work"],
  ["servicesContent", "services"],
  ["legalContent", "legal"],
  ["siteContent", "site"],
] as const;

async function migrate() {
  const database = getDatabase();
  const now = new Date();
  let updated = 0;

  for (const [collection, key] of documents) {
    const result = await database
      .collection(collection)
      .updateOne(
        { key, seo: { $exists: false } },
        { $set: { seo: {}, updatedAt: now } }
      );
    updated += result.modifiedCount;
  }

  console.log(
    `SEO migration complete: ${updated} document${
      updated === 1 ? "" : "s"
    } updated.`
  );
}

migrate()
  .catch((error) => {
    console.error("SEO migration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getMongoClient().close();
  });
