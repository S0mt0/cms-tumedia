import { Db, MongoClient } from "mongodb";

import { getEnvironment } from "@/lib/env";

declare global {
  var mongoClient: MongoClient | undefined;
}

function getMongoUri(): string {
  const { MONGODB_URI } = getEnvironment();
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required for database access.");
  }
  return MONGODB_URI;
}

export function getMongoClient(): MongoClient {
  if (!global.mongoClient) {
    global.mongoClient = new MongoClient(getMongoUri());
  }
  return global.mongoClient;
}

export function getDatabase(): Db {
  return getMongoClient().db(getEnvironment().MONGODB_DB);
}
