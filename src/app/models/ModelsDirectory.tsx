"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { filterModelList } from "@/lib/filterModels";
import type { Brand, Category, Model } from "@/lib/types";

type Props = {
  categories: Category[];
  brands: Brand[];
  models: Model[];
};

function hrefModels(opts: { category?: string; brand?: string }) {
  const q = new URLSearchParams();
  if (opts.category) q.set("category", opts.category);
  if (opts.brand) q.set("brand", opts.brand);
  const s = q.toString();
  return s ? `/models?${s}` : "/models";
}

export function ModelsDirectory({ categories, brands, models }: Props) {
  const sp = useSearchParams();
  const category = sp.get("category") ?? undefined;
  const brand = sp.get("brand") ?? undefined;

  const list = useMemo(
    () =>
      filterModelList(models, {
        categorySlug: category,
        brandSlug: brand,
      }),
    [models, category, brand],
  );

  const chip = (
    label: string,
    active: boolean,
    href: string,
    key: string,
  ) => (
    <Link
      key={key}
      href={href}
      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline border-base-300 text-base-content/80"}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="space-y-8">
      <SectionTitle
        title="型号库"
        description="通过查询参数筛选；每条对应 content/models 下的一个 Markdown 文件。"
      />

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-6 p-4 sm:p-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-base-content/60">
              分类
            </p>
            <div className="flex flex-wrap gap-2">
              {chip("全部", !category, hrefModels({ brand }), "c-all")}
              {categories.map((c) =>
                chip(
                  c.name,
                  category === c.slug,
                  hrefModels({ category: c.slug, brand }),
                  `c-${c.slug}`,
                ),
              )}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-base-content/60">
              品牌
            </p>
            <div className="flex flex-wrap gap-2">
              {chip("全部", !brand, hrefModels({ category }), "b-all")}
              {brands.map((b) =>
                chip(
                  b.name,
                  brand === b.slug,
                  hrefModels({ category, brand: b.slug }),
                  `b-${b.slug}`,
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="alert border border-dashed border-base-300 bg-base-100 text-base-content/70">
          <span>当前筛选下没有条目，请调整分类或品牌。</span>
        </div>
      ) : (
        <ul className="divide-y divide-base-300 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
          {list.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/models/${m.slug}`}
                className="block px-4 py-4 transition-colors hover:bg-base-200"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-lg font-semibold text-base-content">
                    {m.name}
                  </span>
                  {m.year ? (
                    <span className="badge badge-ghost">{m.year}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-base-content/70">{m.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
