"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COMPARE_MODELS_PARAM, MAX_COMPARE_MODELS, parseCompareSlugParam } from "@/lib/compareUtils";
import type { Brand, Category, Model } from "@/lib/types";

const STORAGE_KEY = "ai-bike-compare-models";

type Props = {
  models: Model[];
  brands: Brand[];
  categories: Category[];
  seriesNames: Record<string, string>;
};

function brandName(brands: Brand[], slug: string): string {
  return brands.find((b) => b.slug === slug)?.name ?? slug;
}

function categoryLabels(categories: Category[], slugs: string[]): string {
  return slugs
    .map((s) => categories.find((c) => c.slug === s)?.name ?? s)
    .join(" · ");
}

export function CompareTable({ models, brands, categories, seriesNames }: Props) {
  const sp = useSearchParams();
  const [copied, setCopied] = useState(false);

  const slugs = useMemo(
    () => parseCompareSlugParam(sp.get(COMPARE_MODELS_PARAM)),
    [sp],
  );

  const picked = useMemo(() => {
    const bySlug = new Map(models.map((m) => [m.slug, m]));
    return slugs.map((s) => bySlug.get(s)).filter((m): m is Model => m != null);
  }, [models, slugs]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (slugs.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, slugs.join(","));
      } catch {
        /* ignore */
      }
    }
  }, [slugs]);

  const copyLink = useCallback(() => {
    if (typeof window === "undefined" || picked.length === 0) return;
    const url = window.location.href;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [picked.length]);

  if (picked.length === 0) {
    return (
      <div className="space-y-6">
        <div className="alert border border-base-300 bg-base-100 shadow-sm">
          <div className="text-sm text-base-content/85">
            <p className="font-semibold text-base-content">还没有选择要对比的车款</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                在{" "}
                <Link href="/models" className="link link-primary font-medium">
                  车款库
                </Link>{" "}
                用列表左侧勾选（最多 {MAX_COMPARE_MODELS} 辆），再点「打开对比表」。
              </li>
              <li>在任意车款详情页可点「加入对比」，会与上次对比单合并（仍最多 {MAX_COMPARE_MODELS} 辆）。</li>
            </ul>
          </div>
        </div>
        <Link href="/models" className="btn btn-primary">
          去车款库选车
        </Link>
      </div>
    );
  }

  const rows: { label: string; cells: (string | ReactNode)[] }[] = [
    {
      label: "名称",
      cells: picked.map((m) => (
        <Link key={m.slug} href={`/models/${m.slug}`} className="link link-primary font-semibold">
          {m.name}
        </Link>
      )),
    },
    {
      label: "品牌",
      cells: picked.map((m) => brandName(brands, m.brandSlug)),
    },
    {
      label: "车系",
      cells: picked.map((m) =>
        m.seriesSlug ? (
          <Link key={m.slug} href={`/series/${m.seriesSlug}`} className="link link-hover">
            {seriesNames[m.seriesSlug] ?? m.seriesSlug}
          </Link>
        ) : (
          "—"
        ),
      ),
    },
    {
      label: "分类",
      cells: picked.map((m) => categoryLabels(categories, m.categorySlugs)),
    },
    {
      label: "年款",
      cells: picked.map((m) => (m.year != null ? String(m.year) : "—")),
    },
    {
      label: "指导价",
      cells: picked.map((m) => m.msrp ?? "—"),
    },
    {
      label: "摘要",
      cells: picked.map((m) => m.summary),
    },
    {
      label: "要点",
      cells: picked.map((m) =>
        m.highlights.length > 0 ? (
          <ul key={m.slug} className="list-inside list-disc text-sm">
            {m.highlights.slice(0, 5).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : (
          "—"
        ),
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-base-content/70">
          共 <strong className="text-base-content">{picked.length}</strong> 辆；规格与价格以厂商与经销商为准，本站条目仅供选型梳理。
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={copyLink}>
            {copied ? "已复制链接" : "复制对比链接"}
          </button>
          <Link href="/compare/" className="btn btn-ghost btn-sm">
            清空
          </Link>
          <Link href="/models" className="btn btn-primary btn-sm">
            回车款库继续选
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
        <table className="table table-pin-rows table-sm">
          <thead>
            <tr>
              <th className="w-28 bg-base-200 text-base-content/80">项目</th>
              {picked.map((m) => (
                <th key={m.slug} className="min-w-[12rem] align-bottom">
                  <span className="font-semibold text-base-content">{m.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th className="whitespace-nowrap bg-base-200/80 text-xs font-bold uppercase tracking-wide text-base-content/60">
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td key={picked[i].slug} className="align-top text-sm text-base-content/90">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
