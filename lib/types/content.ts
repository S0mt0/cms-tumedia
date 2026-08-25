export type SeoFields = {
  title: string;
  description: string;
  ogImage?: string;
};

export type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

export type AsyncResult<T = undefined> = {
  error?: string;
  success?: string;
  data?: T;
};

export type CmsDocumentBase = {
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
};
