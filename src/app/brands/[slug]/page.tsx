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

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wide text-base-content/60">
            示例型号
          </h2>
          <Link
            href={`/models?brand=${slug}`}
            className="link link-primary text-sm font-medium"
          >
            型号库中只看该品牌 →
          </Link>
        </div>
        <ul className="divide-y divide-base-300 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
          {list.map((m) => (
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
    </article>
  );
}
