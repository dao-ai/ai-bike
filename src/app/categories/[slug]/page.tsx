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
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          常见子类型
        </h2>
        <ul className="flex flex-wrap gap-2">
          {cat.subtypes.map((s) => (
            <li
              key={s}
              className="rounded-full border border-[var(--edge)] bg-[var(--surface)] px-3 py-1 text-sm"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          实用提示
        </h2>
        <ul className="list-inside list-disc space-y-2 text-[var(--muted)]">
          {cat.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {cat.body ? (
        <section className="rounded-xl border border-[var(--edge)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            扩展阅读
          </h2>
          <MarkdownBody markdown={cat.body} />
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            相关型号
          </h2>
          <Link
            href={`/models?category=${slug}`}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            在型号库中筛选 →
          </Link>
        </div>
        {related.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">暂无关联示例型号。</p>
        ) : (
          <ul className="divide-y divide-[var(--edge)] rounded-xl border border-[var(--edge)] bg-[var(--surface)]">
            {related.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/models/${m.slug}`}
                  className="flex flex-col gap-1 px-4 py-3 transition hover:bg-[var(--surface-2)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="text-sm text-[var(--muted)]">{m.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
