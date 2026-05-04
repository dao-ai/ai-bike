import type { Model } from "./types";

export function filterModelList(
  list: Model[],
  opts: { categorySlug?: string; brandSlug?: string },
): Model[] {
  let out = list;
  if (opts.categorySlug) {
    out = out.filter((m) => m.categorySlugs.includes(opts.categorySlug!));
  }
  if (opts.brandSlug) {
    out = out.filter((m) => m.brandSlug === opts.brandSlug!);
  }
  return out;
}
