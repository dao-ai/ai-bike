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
        <p className="text-sm text-base-content/70">
          {brand ? (
            <Link href={`/brands/${brand.slug}`} className="link link-primary font-medium">
              {brand.name}
            </Link>
          ) : (
            model.brandSlug
          )}
          {model.year ? (
            <span className="before:mx-2 before:content-['·']">{model.year}</span>
          ) : null}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          {model.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base-content/80">{model.summary}</p>
      </div>

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

      {model.body.trim() ? (
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-base-content/60">
              详情说明
            </h2>
            <MarkdownBody markdown={model.body} />
          </div>
        </section>
      ) : null}

      <p className="text-sm text-base-content/70">
        <Link href="/models" className="link link-primary">
          ← 返回型号库
        </Link>
      </p>
    </article>
  );
}
