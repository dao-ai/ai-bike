import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SectionTitle } from "@/components/SectionTitle";
import { getBrand, getSeries, getSeriesSlugs, modelsForSeries } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getSeriesSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) return { title: "未找到" };
  const n = modelsForSeries(slug).length;
  return {
    title: `${s.name}（${n} 款）`,
    description: s.summary,
  };
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) notFound();

  const brand = getBrand(s.brandSlug);
  const models = modelsForSeries(slug);

  return (
    <article className="space-y-8">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link href="/">首页</Link>
          </li>
          <li>
            <Link href="/series">车系</Link>
          </li>
          <li className="opacity-80">
            {s.name}（{models.length} 款）
          </li>
        </ul>
      </div>

      <div>
        <SectionTitle
          title={`${s.name}（${models.length} 款）`}
          description={
            brand
              ? `${brand.name} · ${s.summary}`
              : `${s.brandSlug} · ${s.summary}`
          }
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {brand ? (
            <Link href={`/brands/${brand.slug}`} className="btn btn-outline btn-sm">
              查看品牌页
            </Link>
          ) : null}
          {s.officialModelsUrl ? (
            <a
              href={s.officialModelsUrl}
              className="btn btn-outline btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              官网车款筛选（Bikefinder）↗
            </a>
          ) : null}
        </div>
      </div>

      {s.body ? (
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <MarkdownBody markdown={s.body} />
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-base-content/60">
            该车系下的车款（{models.length}）
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {s.officialModelsUrl ? (
              <a
                href={s.officialModelsUrl}
                className="link link-primary text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                官网车款筛选 ↗
              </a>
            ) : null}
            <Link href="/models" className="link link-primary text-sm font-medium">
              全部车款 →
            </Link>
          </div>
        </div>
        {models.length > 0 ? (
          <ul className="divide-y divide-base-300 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
            {models.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/models/${m.slug}`}
                  className="block px-4 py-3 transition-colors hover:bg-base-200"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <div className="min-w-0 font-semibold text-base-content">{m.name}</div>
                    <div
                      className={`shrink-0 text-right text-sm tabular-nums ${m.msrp ? "font-medium text-primary" : "text-base-content/45"}`}
                    >
                      {m.msrp ?? "—"}
                    </div>
                  </div>
                  <div className="mt-0.5 text-sm text-base-content/70">{m.summary}</div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-base-content/60">
            暂无关联车款。可在{" "}
            <kbd className="kbd kbd-sm">content/models/&lt;slug&gt;.md</kbd>{" "}
            的 frontmatter 中加入 <kbd className="kbd kbd-sm">series: {slug}</kbd>{" "}
            进行关联。
          </p>
        )}
      </section>
    </article>
  );
}
