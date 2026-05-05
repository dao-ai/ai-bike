import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllBrands, getAllCategories, getAllModels, getAllSeries } from "@/lib/content";
import { CompareTable } from "./CompareTable";

export const metadata: Metadata = {
  title: "车型对比",
  description: "并排对比已选车款（名称、品牌、车系、分类、年款、摘要等），链接可分享给他人。",
};

function CompareFallback() {
  return <div className="skeleton h-64 w-full rounded-box" />;
}

export default function ComparePage() {
  const models = getAllModels();
  const brands = getAllBrands();
  const categories = getAllCategories();
  const seriesNames = Object.fromEntries(getAllSeries().map((s) => [s.slug, s.name]));

  return (
    <div className="space-y-8">
      <SectionTitle
        title="车型对比"
        description="最多同时对比 3 辆车款。在车款库勾选或从车款页「加入对比」；复制链接即可让他人在浏览器中打开同一组对比。"
      />
      <Suspense fallback={<CompareFallback />}>
        <CompareTable
          models={models}
          brands={brands}
          categories={categories}
          seriesNames={seriesNames}
        />
      </Suspense>
    </div>
  );
}
