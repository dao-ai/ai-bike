import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBrand,
  getCategory,
  getModel,
  getModelSlugs,
  getSeries,
} from "@/lib/content";
import { AddToCompareButton } from "../AddToCompareButton";
import { ModelGeometryExplorer } from "./ModelGeometryExplorer";
import { ModelDetailTabs } from "./ModelDetailTabs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getModelSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return { title: "未找到" };
  const brand = getBrand(model.brandSlug);
  return {
    title: model.name,
    description: model.summary,
    openGraph: {
      title: model.name,
      description: model.summary,
    },
    ...(brand ? { authors: [{ name: brand.name }] } : {}),
  };
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();

  const brand = getBrand(model.brandSlug);
  const series = model.seriesSlug ? getSeries(model.seriesSlug) : null;

  return (
    <article className="space-y-8">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link href="/">首页</Link>
          </li>
          <li>
            <Link href="/models">车款库</Link>
          </li>
          {series ? (
            <li>
              <Link href={`/series/${series.slug}`}>{series.name}</Link>
            </li>
          ) : null}
          <li className="opacity-80">{model.name}</li>
        </ul>
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-lg">
        <div className="card-body gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70">
            {brand ? (
              <Link href={`/brands/${brand.slug}`} className="link link-primary font-semibold">
                {brand.name}
              </Link>
            ) : (
              <span>{model.brandSlug}</span>
            )}
            {model.year ? (
              <span className="badge badge-ghost badge-sm">年度 {model.year}</span>
            ) : null}
            {model.msrp ? (
              <span className="badge badge-primary badge-outline">{model.msrp}</span>
            ) : null}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl md:text-5xl">
            {model.name}
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-base-content/80">
            {model.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {model.categorySlugs.map((cs) => {
              const cat = getCategory(cs);
              if (!cat) return null;
              return (
                <Link
                  key={cs}
                  href={`/categories/${cs}`}
                  className="badge badge-lg badge-outline border-primary/40 hover:border-primary"
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          <div className="card-actions flex-wrap gap-2 pt-2">
            {model.productUrl ? (
              <a
                href={model.productUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm gap-1"
              >
                原厂 / 车款资讯
                <span className="text-xs opacity-80">↗</span>
              </a>
            ) : null}
            {brand?.site ? (
              <a
                href={brand.site}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm gap-1"
              >
                品牌官网
                <span className="text-xs opacity-80">↗</span>
              </a>
            ) : null}
            <AddToCompareButton slug={slug} />
            <Link href="/models" className="btn btn-ghost btn-sm">
              返回车款库
            </Link>
          </div>
        </div>
      </div>

      {model.sizesNote ? (
        <div className="alert border border-base-300 bg-base-200/80 text-sm text-base-content/90">
          <span>
            <strong className="font-semibold text-base-content">尺码提示：</strong>
            {model.sizesNote}
          </span>
        </div>
      ) : null}

      {model.highlights.length > 0 ? (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <h2 className="card-title text-base text-base-content">要点</h2>
            <ul className="mt-2 space-y-2 text-base-content/85">
              {model.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-primary" aria-hidden>
                    ●
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="alert alert-warning text-sm shadow-sm">
        <span>
          本页分区参考常见品牌「车款详情」信息架构（要点列表 + 概览 / 规格 / 几何 / 技术分区，类似{" "}
          <a
            className="link font-medium"
            href="https://www.merida.cn/"
            target="_blank"
            rel="noreferrer"
          >
            MERIDA 美利达
          </a>{" "}
          官网车款页的编排方式）。<strong>本站表格与长文多为占位或摘要</strong>，配置、几何与售价请以厂商与经销商为准。
        </span>
      </div>

      {model.geometryParsed && model.geometryParsed.columns.length > 0 ? (
        <ModelGeometryExplorer modelName={model.name} parsed={model.geometryParsed} />
      ) : null}

      <ModelDetailTabs
        body={model.body}
        specAttributes={model.specAttributes}
        specsMd={model.specsMd}
        geometryMd={model.geometryMd}
        technologyMd={model.technologyMd}
        intendedUse={model.intendedUse}
      />

      <p className="text-center text-sm text-base-content/60">
        <Link href="/models" className="link link-primary">
          ← 返回车款库
        </Link>
      </p>
    </article>
  );
}
