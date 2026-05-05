"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Category, Model, Series } from "@/lib/types";

type NavCat = Pick<Category, "slug" | "name">;

type Props = {
  brandSlug: string;
  navCategories: NavCat[];
  seriesList: Series[];
  modelsList: Model[];
};

export function BrandDetailCategoryFilter({
  brandSlug,
  navCategories,
  seriesList,
  modelsList,
}: Props) {
  const sp = useSearchParams();
  const category = sp.get("category")?.trim() || undefined;

  const filteredSeries = category
    ? seriesList.filter((s) => s.categorySlugs.includes(category))
    : seriesList;

  const modelCountBySeries = useMemo(() => {
    const m: Record<string, number> = {};
    for (const model of modelsList) {
      if (!model.seriesSlug) continue;
      m[model.seriesSlug] = (m[model.seriesSlug] ?? 0) + 1;
    }
    return m;
  }, [modelsList]);

  const brandBase = `/brands/${brandSlug}/`;
  const hrefBrand = (cat?: string) =>
    cat ? `${brandBase}?category=${encodeURIComponent(cat)}` : brandBase;

  const chip = (label: string, active: boolean, href: string, key: string) => (
    <Link
      key={key}
      href={href}
      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline border-base-300 text-base-content/80"}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <nav
        className="card border border-base-300 bg-base-100 shadow-sm"
        aria-label="按分类筛选本页车系"
      >
        <div className="card-body gap-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-base-content/60">
              按分类（本页车系）
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <Link href="/categories" className="link link-primary font-medium">
                全部车型分类 →
              </Link>
              <Link
                href={
                  category
                    ? `/models?brand=${encodeURIComponent(brandSlug)}&category=${encodeURIComponent(category)}`
                    : `/models?brand=${encodeURIComponent(brandSlug)}`
                }
                className="link link-secondary font-medium"
              >
                车款库中打开 →
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {chip("全部车系", !category, hrefBrand(undefined), "cat-all")}
            {navCategories.map((c) =>
              chip(c.name, category === c.slug, hrefBrand(c.slug), `cat-${c.slug}`),
            )}
          </div>
        </div>
      </nav>

      {seriesList.length > 0 ? (
        <section>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-base-content/60">
              车系
              {category ? (
                <span className="ml-2 font-normal normal-case text-base-content/50">
                  （已按分类筛选）
                </span>
              ) : null}
            </h2>
            <Link href="/series" className="link link-primary text-sm font-medium">
              全部车系 →
            </Link>
          </div>
          {filteredSeries.length > 0 ? (
            <ul className="divide-y divide-base-300 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
              {filteredSeries.map((s) => {
                const n = modelCountBySeries[s.slug] ?? 0;
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/series/${s.slug}`}
                      className="block px-4 py-3 transition-colors hover:bg-base-200"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="font-semibold text-base-content">{s.name}</span>
                        <span className="text-sm font-medium tabular-nums text-base-content/60">
                          （{n} 款）
                        </span>
                      </div>
                      <div className="text-sm text-base-content/70">{s.summary}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="alert border border-dashed border-base-300 bg-base-100 text-sm text-base-content/80">
              <span>
                当前分类下没有对应车系。
                <Link href={hrefBrand(undefined)} className="link link-primary ml-1 font-medium">
                  清除筛选
                </Link>
              </span>
            </div>
          )}
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-base-content/60">
            车款
          </h2>
          <Link
            href={`/models?brand=${brandSlug}`}
            className="link link-primary text-sm font-medium"
          >
            车款库中只看该品牌 →
          </Link>
        </div>
        <ul className="divide-y divide-base-300 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
          {modelsList.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/models/${m.slug}`}
                className="block px-4 py-3 transition-colors hover:bg-base-200"
              >
                <div className="font-semibold text-base-content">{m.name}</div>
                <div className="text-sm text-base-content/70">{m.summary}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
