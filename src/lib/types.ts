import type { ParsedGeometry } from "./parseGeometryTable";

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

/** 车系（产品线），其下挂多条具体车款 Model */
export type Series = {
  slug: string;
  name: string;
  brandSlug: string;
  categorySlugs: string[];
  summary: string;
  body: string;
  /** 品牌官网该车系筛选/列表页（如美利达 Bikefinder） */
  officialModelsUrl?: string;
};

export type Model = {
  slug: string;
  name: string;
  brandSlug: string;
  /** 所属车系 slug，对应 content/series/<slug>.md */
  seriesSlug?: string;
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
  /**
   * 结构化规格属性（美利达 bikefinder「规格」区块式：部位 + 配置说明）。
   * 对应 frontmatter `specAttributes` YAML 数组。
   */
  specAttributes?: { label: string; value: string }[];
  /** 用途 / 分类标签（如 INTENDED USE），对应 frontmatter `intendedUse` */
  intendedUse?: string;
  /** 规格表 Markdown（可与 specAttributes 并存，作补充表格） */
  specsMd?: string;
  /** 几何表 Markdown */
  geometryMd?: string;
  /** 由 `geometry` Markdown 表格解析，用于车款页交互示意 */
  geometryParsed?: ParsedGeometry;
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
