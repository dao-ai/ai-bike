"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/SectionTitle";
import { buildCompareHref, MAX_COMPARE_MODELS } from "@/lib/compareUtils";
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

  const [q, setQ] = useState("");
  const [comparePick, setComparePick] = useState<Set<string>>(() => new Set());

  const baseList = useMemo(
    () =>
      filterModelList(models, {
        categorySlug: category,
        brandSlug: brand,
      }),
    [models, category, brand],
  );

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return baseList;
    return baseList.filter(
      (m) =>
        m.name.toLowerCase().includes(t) ||
        m.slug.toLowerCase().includes(t) ||
        m.summary.toLowerCase().includes(t),
    );
  }, [baseList, q]);

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

  const toggleCompare = (slug: string) => {
    setComparePick((prev) => {
      const n = new Set(prev);
      if (n.has(slug)) {
        n.delete(slug);
        return n;
      }
      if (n.size >= MAX_COMPARE_MODELS) return n;
      n.add(slug);
      return n;
    });
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="车款库"
        description="按分类与品牌缩小范围，用关键词搜索车款名或摘要；勾选最多三辆可并排对比，也可复制对比页链接给他人。"
      />

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-6 p-4 sm:p-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-base-content/60">
              关键词
            </p>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索车款名称、slug 或摘要…"
              className="input input-bordered w-full max-w-xl"
              autoComplete="off"
            />
          </div>
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
          <div className="flex flex-wrap items-center gap-3 border-t border-base-200 pt-4 text-sm">
            <Link href="/compare/" className="link link-secondary font-medium">
              打开对比页（空表）
            </Link>
            <span className="text-base-content/50">|</span>
            <span className="text-base-content/70">
              列表左侧勾选后点底部「打开对比表」，最多 {MAX_COMPARE_MODELS} 辆
            </span>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="alert border border-dashed border-base-300 bg-base-100 text-base-content/70">
          <span>当前筛选或搜索下没有条目，请调整条件。</span>
        </div>
      ) : (
        <ul className="divide-y divide-base-300 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
          {list.map((m) => (
            <li key={m.slug} className="flex items-stretch">
              <label className="flex w-12 shrink-0 cursor-pointer items-center justify-center border-r border-base-300 hover:bg-base-200/80">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  checked={comparePick.has(m.slug)}
                  onChange={() => toggleCompare(m.slug)}
                  title="加入对比"
                  aria-label={`将 ${m.name} 加入对比`}
                />
              </label>
              <Link
                href={`/models/${m.slug}`}
                className="block min-w-0 flex-1 px-4 py-4 transition-colors hover:bg-base-200"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-lg font-semibold text-base-content">{m.name}</span>
                  {m.year ? <span className="badge badge-ghost">{m.year}</span> : null}
                </div>
                <p className="mt-1 text-sm text-base-content/70">{m.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {comparePick.size > 0 ? (
        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-box border border-primary/30 bg-base-100/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <span className="text-sm font-medium text-base-content">
            已选 <strong className="text-primary">{comparePick.size}</strong> 辆（最多 {MAX_COMPARE_MODELS}）
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setComparePick(new Set())}
            >
              清空勾选
            </button>
            <Link href={buildCompareHref([...comparePick])} className="btn btn-primary btn-sm">
              打开对比表
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
