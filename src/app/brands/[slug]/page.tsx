import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SectionTitle } from "@/components/SectionTitle";
import { BrandDetailCategoryFilter } from "./BrandDetailCategoryFilter";
import {
  getAllCategories,
  getBrand,
  getBrandSlugs,
  modelsForBrand,
  seriesForBrand,
} from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBrandSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: "未找到" };
  return {
    title: brand.name,
    description: brand.summary,
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const seriesList = seriesForBrand(slug);
  const list = modelsForBrand(slug);

  const categorySlugs = new Set<string>();
  for (const m of list) {
    for (const c of m.categorySlugs) categorySlugs.add(c);
  }
  for (const s of seriesList) {
    for (const c of s.categorySlugs) categorySlugs.add(c);
  }
  const navCategories = getAllCategories().filter((c) => categorySlugs.has(c.slug));

  return (
    <article className="space-y-8">
      <div>
        <SectionTitle
          title={brand.name}
          description={`${brand.country} · ${brand.summary}`}
        />
        {brand.site ? (
          <a
            href={brand.site}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm mt-3 gap-2"
          >
            访问官网
            <span className="text-xs opacity-80">↗</span>
          </a>
        ) : null}
      </div>

      {brand.body ? (
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <MarkdownBody markdown={brand.body} />
          </div>
        </section>
      ) : null}

      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="skeleton h-28 w-full rounded-box" />
            <div className="skeleton h-40 w-full rounded-box" />
            <div className="skeleton h-48 w-full rounded-box" />
          </div>
        }
      >
        <BrandDetailCategoryFilter
          brandSlug={slug}
          navCategories={navCategories.map((c) => ({ slug: c.slug, name: c.name }))}
          seriesList={seriesList}
          modelsList={list}
        />
      </Suspense>
    </article>
  );
}
