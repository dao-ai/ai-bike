"use client";

import { useMemo, useState } from "react";
import { MarkdownBody } from "@/components/MarkdownBody";

type TabId = "overview" | "specs" | "geometry" | "technology";

type Props = {
  body: string;
  specsMd?: string;
  geometryMd?: string;
  technologyMd?: string;
};

function firstTab(p: Props): TabId {
  if (p.body.trim()) return "overview";
  if (p.specsMd?.trim()) return "specs";
  if (p.geometryMd?.trim()) return "geometry";
  return "technology";
}

export function ModelDetailTabs({ body, specsMd, geometryMd, technologyMd }: Props) {
  const tabs = useMemo(
    () =>
      [
        { id: "overview" as const, label: "概览", md: body },
        { id: "specs" as const, label: "规格", md: specsMd ?? "" },
        { id: "geometry" as const, label: "几何", md: geometryMd ?? "" },
        { id: "technology" as const, label: "技术", md: technologyMd ?? "" },
      ].filter((t) => t.md.trim()),
    [body, specsMd, geometryMd, technologyMd],
  );

  const [tab, setTab] = useState<TabId>(() => firstTab({ body, specsMd, geometryMd, technologyMd }));

  if (tabs.length === 0) {
    return (
      <div className="alert alert-info">
        <span>暂无详情正文；可在该型号的 Markdown 中补充「概览 / 规格 / 几何 / 技术」区块。</span>
      </div>
    );
  }

  if (tabs.length === 1) {
    return (
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5 sm:p-6">
          <MarkdownBody markdown={tabs[0].md} />
        </div>
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
        <div className="card-body p-5 sm:p-6">
          <MarkdownBody key={active.id} markdown={active.md} />
        </div>
      </div>
    </div>
  );
}
