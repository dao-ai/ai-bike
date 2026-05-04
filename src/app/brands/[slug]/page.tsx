import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SectionTitle } from "@/components/SectionTitle";
import { getBrand, getBrandSlugs, modelsForBrand } from "@/lib/content";

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

  const list = modelsForBrand(slug);

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
            className="mt-2 inline-flex text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            访问官网（新窗口）
          </a>
        ) : null}
      </div>

      {brand.body ? (
        <section className="rounded-xl border border-[var(--edge)] bg-[var(--surface)] p-5 sm:p-6">
          <MarkdownBody markdown={brand.body} />
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            示例型号
          </h2>
          <Link
            href={`/models?brand=${slug}`}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            型号库中只看该品牌 →
          </Link>
        </div>
        <ul className="divide-y divide-[var(--edge)] rounded-xl border border-[var(--edge)] bg-[var(--surface)]">
          {list.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/models/${m.slug}`}
                className="block px-4 py-3 transition hover:bg-[var(--surface-2)]"
              >
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-[var(--muted)]">{m.summary}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
