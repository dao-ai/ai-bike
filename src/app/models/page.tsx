import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBrands, getAllCategories, getAllModels } from "@/lib/content";
import { ModelsDirectory } from "./ModelsDirectory";

export const metadata: Metadata = {
  title: "型号",
  description: "按品牌与分类筛选的型号库（Markdown 数据源）。",
};

function ModelsFallback() {
  return (
    <div className="space-y-8">
      <div className="h-24 animate-pulse rounded-xl bg-[var(--surface-2)]" />
      <div className="h-40 animate-pulse rounded-xl bg-[var(--surface-2)]" />
    </div>
  );
}

export default function ModelsPage() {
  const categories = getAllCategories();
  const brands = getAllBrands();
  const models = getAllModels();

  return (
    <Suspense fallback={<ModelsFallback />}>
      <ModelsDirectory
        categories={categories}
        brands={brands}
        models={models}
      />
    </Suspense>
  );
}
