import type { Metadata } from "next";
import { CardGrid } from "@/components/CardGrid";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllBrands } from "@/lib/content";

export const metadata: Metadata = {
  title: "品牌",
  description: "常见整车品牌简介与官网链接。",
};

export default function BrandsPage() {
  const brands = getAllBrands();
  return (
    <div>
      <SectionTitle
        title="品牌索引"
        description="数据来自 content/brands 目录下的 Markdown 文件。"
      />
      <CardGrid
        items={brands.map((b) => ({
          href: `/brands/${b.slug}`,
          title: `${b.name} · ${b.country}`,
          subtitle: b.summary,
        }))}
      />
    </div>
  );
}
