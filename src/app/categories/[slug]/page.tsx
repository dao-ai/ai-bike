import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SectionTitle } from "@/components/SectionTitle";
import {
  getCategory,
  getCategorySlugs,
  modelsForCategory,
} from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return { title: "未找到" };
  return {
    title: cat.name,
    description: cat.summary,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const related = modelsForCategory(slug);

  return (
    <article className="space-y-10">
      <SectionTitle title={cat.name} description={cat.summary} />

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-base-content/60">
          常见子类型
        </h2>
        <div className="flex flex-wrap gap-2">
          {cat.subtypes.map((s) => {
            const q = new URLSearchParams({ category: slug, q: s }).toString();
            return (
              <Link
                key={s}
                href={`/models/?${q}`}
                className="badge badge-lg badge-outline border-base-300 transition-colors hover:border-primary hover:bg-primary/5"
              >
                {s}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-base-content/60">
          实用提示
        </h2>
        <ul className="list-inside list-disc space-y-2 text-base-content/80">
          {cat.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {cat.body ? (
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-base-content/60">
              扩展阅读
            </h2>
            <MarkdownBody markdown={cat.body} />
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-base-content/60">
            相关型号
          </h2>
          <Link href={`/models/?category=${encodeURIComponent(slug)}`} className="link link-primary text-sm font-medium">
            在型号库中筛选 →
          </Link>
        </div>
        {related.length === 0 ? (
          <p className="text-sm text-base-content/60">暂无关联示例型号。</p>
        ) : (
          <ul className="divide-y divide-base-300 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
            {related.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/models/${m.slug}`}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-base-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold text-base-content">{m.name}</span>
                  <span className="text-sm text-base-content/70">{m.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
