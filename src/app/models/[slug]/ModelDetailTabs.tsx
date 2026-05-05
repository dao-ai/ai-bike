"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SpecAttributesTable } from "@/components/SpecAttributesTable";

type TabId = "overview" | "specs" | "geometry" | "technology" | "classification";

type Props = {
  body: string;
  specAttributes?: { label: string; value: string }[];
  specsMd?: string;
  geometryMd?: string;
  technologyMd?: string;
  intendedUse?: string;
};

function firstTab(p: Props): TabId {
  if (p.body.trim()) return "overview";
  if ((p.specAttributes?.length ?? 0) > 0 || (p.specsMd?.trim()?.length ?? 0) > 0) return "specs";
  if (p.geometryMd?.trim()) return "geometry";
  if (p.technologyMd?.trim()) return "technology";
  if (p.intendedUse?.trim()) return "classification";
  return "overview";
}

export function ModelDetailTabs({
  body,
  specAttributes,
  specsMd,
  geometryMd,
  technologyMd,
  intendedUse,
}: Props) {
  const tabs = useMemo(() => {
    const rows: { id: TabId; label: string; content: ReactNode }[] = [];
    if (body.trim()) {
      rows.push({
        id: "overview",
        label: "概览",
        content: <MarkdownBody markdown={body} />,
      });
    }
    const hasSpecs = (specAttributes?.length ?? 0) > 0 || !!specsMd?.trim();
    if (hasSpecs) {
      rows.push({
        id: "specs",
        label: "规格",
        content: (
          <div className="space-y-8">
            <SpecAttributesTable items={specAttributes ?? []} />
            {specsMd?.trim() ? (
              <section className="not-prose max-w-none">
                {specAttributes && specAttributes.length > 0 ? (
                  <h3 className="mb-3 border-b border-base-300 pb-2 text-sm font-bold uppercase tracking-wide text-base-content/70">
                    补充说明 / 表格
                  </h3>
                ) : null}
                <MarkdownBody markdown={specsMd} />
              </section>
            ) : null}
          </div>
        ),
      });
    }
    if (geometryMd?.trim()) {
      rows.push({
        id: "geometry",
        label: "几何",
        content: <MarkdownBody markdown={geometryMd} />,
      });
    }
    if (technologyMd?.trim()) {
      rows.push({
        id: "technology",
        label: "技术",
        content: <MarkdownBody markdown={technologyMd} />,
      });
    }
    if (intendedUse?.trim()) {
      rows.push({
        id: "classification",
        label: "分类",
        content: (
          <div className="space-y-4 text-sm leading-relaxed text-base-content/90">
            <p>
              用途 / 强度分类常见于品牌官网车款页底部，用于提示设计取向与适用路况（以下为知识库字段演示）。
            </p>
            <p className="rounded-lg border border-base-300 bg-base-200/60 px-4 py-3 font-medium text-base-content">
              {intendedUse}
            </p>
          </div>
        ),
      });
    }
    return rows;
  }, [body, specAttributes, specsMd, geometryMd, technologyMd, intendedUse]);

  const [tab, setTab] = useState<TabId>(() =>
    firstTab({ body, specAttributes, specsMd, geometryMd, technologyMd, intendedUse }),
  );

  if (tabs.length === 0) {
    return (
      <div className="alert alert-info">
        <span>
          暂无详情正文；可在该车款 Markdown 中补充「概览」「specAttributes（规格属性）」「规格 / 几何 /
          技术」或 intendedUse（分类）等字段。
        </span>
      </div>
    );
  }

  if (tabs.length === 1) {
    return (
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5 sm:p-6">{tabs[0].content}</div>
      </div>
    );
  }

  const active = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <div className="w-full">
      <div role="tablist" className="tabs tabs-boxed tabs-sm flex-wrap gap-1 sm:tabs-md">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? "tab-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="card mt-3 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5 sm:p-6">{active.content}</div>
      </div>
    </div>
  );
}
