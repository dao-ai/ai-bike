export type Category = {
  slug: string;
  name: string;
  summary: string;
  subtypes: string[];
  tips: string[];
  /** 正文 Markdown，可为空 */
  body: string;
};

export type Brand = {
  slug: string;
  name: string;
  country: string;
  summary: string;
  site?: string;
  body: string;
};

export type Model = {
  slug: string;
  name: string;
  brandSlug: string;
  categorySlugs: string[];
  year?: number;
  summary: string;
  /** 详情正文 Markdown */
  body: string;
};

export type ConsultItem = {
  id: string;
  question: string;
  tags: string[];
  relatedModelSlugs?: string[];
  relatedCategorySlugs?: string[];
  /** 回答正文 Markdown */
  body: string;
};
