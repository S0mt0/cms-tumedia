type OrderedItem = { id: string; order: number };

type SeoFields = {
  title: string;
  description: string;
  ogImage?: string;
};

type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

type AsyncResult<T = undefined> = {
  error?: string;
  success?: string;
  data?: T;
};

type CmsDocumentBase = {
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
};
