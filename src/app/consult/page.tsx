import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllConsultItems, getCategory, getModel } from "@/lib/content";

export const metadata: Metadata = {
  title: "咨询",
  description: "选购、保养与车型相关的常见问题与参考解答。",
};

export default function ConsultPage() {
  const consultItems = getAllConsultItems();

  return (
    <div className="space-y-8">
      <SectionTitle
        title="咨询与问答"
        description="条目来自 content/consult 目录；正文支持 Markdown 格式。"
      />

      <div className="space-y-6">
        {consultItems.map((item) => (
          <article
            key={item.id}
            id={item.id}
            className="card scroll-mt-24 border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-5 sm:p-6">
              <h2 className="card-title text-lg leading-snug text-base-content">
                {item.question}
              </h2>
              <div className="mt-3 text-base-content/80">
                <MarkdownBody markdown={item.body} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <span key={t} className="badge badge-neutral badge-outline">
                    {t}
                  </span>
                ))}
              </div>
              {item.relatedCategorySlugs?.length || item.relatedModelSlugs?.length ? (
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {item.relatedCategorySlugs?.map((slug) => {
                    const c = getCategory(slug);
                    if (!c) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/categories/${slug}`}
                        className="link link-primary"
                      >
                        分类：{c.name}
                      </Link>
                    );
                  })}
                  {item.relatedModelSlugs?.map((slug) => {
                    const m = getModel(slug);
                    if (!m) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/models/${slug}`}
                        className="link link-primary"
                      >
                        型号：{m.name}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
