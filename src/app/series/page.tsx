import type { Metadata } from "next";
import { CardGrid } from "@/components/CardGrid";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllSeries, modelCountsBySeriesSlug } from "@/lib/content";

export const metadata: Metadata = {
  title: "车系",
  description: "按品牌产品线（车系）浏览，点入可查看该车系下的具体车款。",
};

export default function SeriesIndexPage() {
  const series = getAllSeries();
  const counts = modelCountsBySeriesSlug();
  return (
    <div>
      <SectionTitle
        title="车系"
        description="结构与常见品牌官网类似：先选产品线（车系），再进入具体配置与车款。名称后括号内为当前知识库中已关联车款数量。"
      />
      <CardGrid
        items={series.map((s) => {
          const n = counts[s.slug] ?? 0;
          return {
            href: `/series/${s.slug}`,
            title: `${s.name}（${n} 款）`,
            subtitle: s.summary,
          };
        })}
      />
    </div>
  );
}
