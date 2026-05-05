import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { filterModelList } from "./filterModels";
import { parseGeometryTable } from "./parseGeometryTable";
import type { Brand, Category, ConsultItem, Model, Series } from "./types";

const ROOT = path.join(process.cwd(), "content");

function listMarkdownSlugs(subdir: string): string[] {
  const dir = path.join(ROOT, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function readFile(subdir: string, slug: string): string | null {
  const fp = path.join(ROOT, subdir, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  return fs.readFileSync(fp, "utf8");
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v.trim()) return [v];
  return [];
}

function optionalTrimmedString(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s ? s : undefined;
}

function asSpecAttributes(v: unknown): { label: string; value: string }[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: { label: string; value: string }[] = [];
  for (const item of v) {
    if (item && typeof item === "object" && "label" in item && "value" in item) {
      const label = String((item as { label: unknown }).label ?? "").trim();
      const value = String((item as { value: unknown }).value ?? "").trim();
      if (label && value) out.push({ label, value });
    }
  }
  return out.length > 0 ? out : undefined;
}

function parseCategory(slug: string, raw: string): Category {
  const { data, content } = matter(raw);
  return {
    slug,
    name: String(data.name ?? slug),
    summary: String(data.summary ?? ""),
    subtypes: asStringArray(data.subtypes),
    tips: asStringArray(data.tips),
    body: String(content ?? "").trim(),
  };
}

function parseBrand(slug: string, raw: string): Brand {
  const { data, content } = matter(raw);
  return {
    slug,
    name: String(data.name ?? slug),
    country: String(data.country ?? ""),
    summary: String(data.summary ?? ""),
    site: data.site ? String(data.site) : undefined,
    body: String(content ?? "").trim(),
  };
}

function parseSeries(slug: string, raw: string): Series {
  const { data, content } = matter(raw);
  return {
    slug,
    name: String(data.name ?? slug),
    brandSlug: String(data.brand ?? ""),
    categorySlugs: asStringArray(data.categories),
    summary: String(data.summary ?? ""),
    body: String(content ?? "").trim(),
    officialModelsUrl: optionalTrimmedString(data.officialModelsUrl),
  };
}

function parseModel(slug: string, raw: string): Model {
  const { data, content } = matter(raw);
  return {
    slug,
    name: String(data.name ?? slug),
    brandSlug: String(data.brand ?? ""),
    seriesSlug: optionalTrimmedString(data.series),
    categorySlugs: asStringArray(data.categories),
    year: typeof data.year === "number" ? data.year : undefined,
    summary: String(data.summary ?? ""),
    body: String(content ?? "").trim(),
    highlights: asStringArray(data.highlights),
    msrp: optionalTrimmedString(data.msrp),
    productUrl: optionalTrimmedString(data.productUrl),
    sizesNote: optionalTrimmedString(data.sizesNote),
    specAttributes: asSpecAttributes(data.specAttributes),
    intendedUse: optionalTrimmedString(data.intendedUse),
    specsMd: optionalTrimmedString(data.specs),
    geometryMd: optionalTrimmedString(data.geometry),
    geometryParsed: parseGeometryTable(optionalTrimmedString(data.geometry)),
    technologyMd: optionalTrimmedString(data.technology),
  };
}

function parseConsult(id: string, raw: string): ConsultItem {
  const { data, content } = matter(raw);
  return {
    id,
    question: String(data.question ?? ""),
    tags: asStringArray(data.tags),
    relatedModelSlugs: asStringArray(data.relatedModels),
    relatedCategorySlugs: asStringArray(data.relatedCategories),
    body: String(content ?? "").trim(),
  };
}

function sortByOrder<T>(
  items: T[],
  getSlug: (item: T) => string,
  getOrder: (slug: string) => number,
): T[] {
  return [...items].sort((a, b) => {
    const sa = getSlug(a);
    const sb = getSlug(b);
    const oa = getOrder(sa);
    const ob = getOrder(sb);
    if (oa !== ob) return oa - ob;
    return sa.localeCompare(sb);
  });
}

function readOrder(subdir: string, slug: string): number {
  const raw = readFile(subdir, slug);
  if (!raw) return 0;
  const { data } = matter(raw);
  return typeof data.order === "number" ? data.order : 0;
}

export function getCategorySlugs(): string[] {
  return listMarkdownSlugs("categories");
}

export function getBrandSlugs(): string[] {
  return listMarkdownSlugs("brands");
}

export function getModelSlugs(): string[] {
  return listMarkdownSlugs("models");
}

export function getSeriesSlugs(): string[] {
  return listMarkdownSlugs("series");
}

export function getConsultIds(): string[] {
  return listMarkdownSlugs("consult");
}

export function getAllCategories(): Category[] {
  const slugs = getCategorySlugs();
  const items = slugs
    .map((slug) => {
      const raw = readFile("categories", slug);
      return raw ? parseCategory(slug, raw) : null;
    })
    .filter((x): x is Category => x !== null);
  return sortByOrder(items, (c) => c.slug, (s) => readOrder("categories", s));
}

export function getCategory(slug: string): Category | null {
  const raw = readFile("categories", slug);
  if (!raw) return null;
  return parseCategory(slug, raw);
}

export function getAllBrands(): Brand[] {
  const slugs = getBrandSlugs();
  const items = slugs
    .map((slug) => {
      const raw = readFile("brands", slug);
      return raw ? parseBrand(slug, raw) : null;
    })
    .filter((x): x is Brand => x !== null);
  return sortByOrder(items, (b) => b.slug, (s) => readOrder("brands", s));
}

export function getBrand(slug: string): Brand | null {
  const raw = readFile("brands", slug);
  if (!raw) return null;
  return parseBrand(slug, raw);
}

export function getAllSeries(): Series[] {
  const slugs = getSeriesSlugs();
  const items = slugs
    .map((slug) => {
      const raw = readFile("series", slug);
      return raw ? parseSeries(slug, raw) : null;
    })
    .filter((x): x is Series => x !== null);
  return sortByOrder(items, (s) => s.slug, (slug) => readOrder("series", slug));
}

export function getSeries(slug: string): Series | null {
  const raw = readFile("series", slug);
  if (!raw) return null;
  return parseSeries(slug, raw);
}

export function getAllModels(): Model[] {
  const slugs = getModelSlugs();
  const items = slugs
    .map((slug) => {
      const raw = readFile("models", slug);
      return raw ? parseModel(slug, raw) : null;
    })
    .filter((x): x is Model => x !== null);
  return sortByOrder(items, (m) => m.slug, (s) => readOrder("models", s));
}

export function getModel(slug: string): Model | null {
  const raw = readFile("models", slug);
  if (!raw) return null;
  return parseModel(slug, raw);
}

export function modelsForBrand(brandSlug: string): Model[] {
  return getAllModels().filter((m) => m.brandSlug === brandSlug);
}

export function seriesForBrand(brandSlug: string): Series[] {
  return getAllSeries().filter((s) => s.brandSlug === brandSlug);
}

export function modelsForSeries(seriesSlug: string): Model[] {
  return getAllModels().filter((m) => m.seriesSlug === seriesSlug);
}

/** 各车系下已关联车款数量（仅统计 frontmatter 含 `series` 的 models） */
export function modelCountsBySeriesSlug(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const model of getAllModels()) {
    if (!model.seriesSlug) continue;
    counts[model.seriesSlug] = (counts[model.seriesSlug] ?? 0) + 1;
  }
  return counts;
}

export function modelsForCategory(categorySlug: string): Model[] {
  return getAllModels().filter((m) => m.categorySlugs.includes(categorySlug));
}

export function filterModels(opts: {
  categorySlug?: string;
  brandSlug?: string;
}): Model[] {
  return filterModelList(getAllModels(), opts);
}

export function getAllConsultItems(): ConsultItem[] {
  const slugs = getConsultIds();
  const items = slugs
    .map((slug) => {
      const raw = readFile("consult", slug);
      return raw ? parseConsult(slug, raw) : null;
    })
    .filter((x): x is ConsultItem => x !== null);
  return sortByOrder(items, (c) => c.id, (s) => readOrder("consult", s));
}
