import "dotenv/config";

import { MongoClient } from "mongodb";

import { getEnvironment } from "../env";

const uri = getEnvironment().MONGODB_URI;

if (!uri) throw new Error("MONGODB_URI is required.");

const client = new MongoClient(uri);

console.log(
  "Resetting database:",
  uri.includes("mongodb+srv") ? "Atlas database (Production)" : "local database"
);

async function resetDb() {
  try {
    await client.connect();

    const db = client.db(getEnvironment().MONGODB_DB);

    await db.dropDatabase();

    console.log("Database dropped successfully.");
  } catch (error) {
    console.error("Failed to reset database:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

resetDb();
