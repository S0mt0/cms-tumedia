import type { WithId } from "mongodb";

import { BaseRepository } from "@/lib/db/repositories/base.repository";
import type { MediaAsset } from "@/lib/types/media";

class MediaRepository extends BaseRepository<MediaAsset> {
  protected readonly collectionName = "mediaAssets";

  async create(asset: MediaAsset): Promise<WithId<MediaAsset>> {
    return this.insertOne(asset);
  }
}

export const mediaRepository = new MediaRepository();
