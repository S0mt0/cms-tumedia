import type {
  Collection,
  Filter,
  OptionalUnlessRequiredId,
  UpdateFilter,
  WithId,
} from "mongodb";

import { getDatabase } from "@/lib/db/config";

export abstract class BaseRepository<TDocument extends object> {
  protected abstract readonly collectionName: string;

  protected collection(): Collection<TDocument> {
    return getDatabase().collection<TDocument>(this.collectionName);
  }

  protected async findOne(
    filter: Filter<TDocument>
  ): Promise<WithId<TDocument> | null> {
    return this.collection().findOne(filter);
  }

  protected async insertOne(
    document: OptionalUnlessRequiredId<TDocument>
  ): Promise<WithId<TDocument>> {
    const collection = this.collection();
    const result = await collection.insertOne(document);
    return { ...document, _id: result.insertedId } as WithId<TDocument>;
  }

  protected async updateOne(
    filter: Filter<TDocument>,
    update: UpdateFilter<TDocument>
  ): Promise<WithId<TDocument> | null> {
    return this.collection().findOneAndUpdate(filter, update, {
      returnDocument: "after",
    });
  }

  protected async deleteOne(filter: Filter<TDocument>): Promise<void> {
    await this.collection().deleteOne(filter);
  }
}
