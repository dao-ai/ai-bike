import type { Metadata } from "next";
import { CardGrid } from "@/components/CardGrid";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "分类",
  description: "山地、公路、Gravel、城市通勤与电助力等车型说明。",
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  return (
    <div>
      <SectionTitle
        title="车型分类"
        description="从用途与路况出发选择大类，再进入子类型与代表车款。"
      />
      <CardGrid
        items={categories.map((c) => ({
          href: `/categories/${c.slug}`,
          title: c.name,
          subtitle: c.summary,
        }))}
      />
    </div>
  );
}
