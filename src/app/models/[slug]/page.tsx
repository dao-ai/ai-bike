import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getBrand, getCategory, getModel, getModelSlugs } from "@/lib/content";

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

  return (
    <article className="space-y-8">
      <div>
        <p className="text-sm text-[var(--muted)]">
          {brand ? (
            <Link
              href={`/brands/${brand.slug}`}
              className="font-medium text-[var(--accent)] hover:underline"
            >
              {brand.name}
            </Link>
          ) : (
            model.brandSlug
          )}
          {model.year ? (
            <span className="before:mx-2 before:content-['·']">{model.year}</span>
          ) : null}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{model.name}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{model.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {model.categorySlugs.map((cs) => {
          const cat = getCategory(cs);
          if (!cat) return null;
          return (
            <Link
              key={cs}
              href={`/categories/${cs}`}
              className="rounded-full border border-[var(--edge)] bg-[var(--surface-2)] px-3 py-1 text-sm hover:border-[var(--accent)]/50"
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {model.body.trim() ? (
        <section className="rounded-xl border border-[var(--edge)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            详情说明
          </h2>
          <div className="mt-3">
            <MarkdownBody markdown={model.body} />
          </div>
        </section>
      ) : null}

      <p className="text-sm text-[var(--muted)]">
        <Link href="/models" className="text-[var(--accent)] hover:underline">
          ← 返回型号库
        </Link>
      </p>
    </article>
  );
}
