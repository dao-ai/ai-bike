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
  /** 详情正文 Markdown（概览 / 长文） */
  body: string;
  /** 卖点短句，类似官网要点列表 */
  highlights: string[];
  /** 建议零售价等，如「建议零售价：14800 元」 */
  msrp?: string;
  /** 原厂车款介绍页（如品牌 bikefinder） */
  productUrl?: string;
  /** 尺码建议一句说明 */
  sizesNote?: string;
  /** 规格表 Markdown（多为表格） */
  specsMd?: string;
  /** 几何表 Markdown */
  geometryMd?: string;
  /** 技术说明 Markdown */
  technologyMd?: string;
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
