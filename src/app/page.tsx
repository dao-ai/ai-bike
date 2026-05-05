import Link from "next/link";
import { CardGrid } from "@/components/CardGrid";
import {
  getAllBrands,
  getAllCategories,
  getAllModels,
} from "@/lib/content";

export default function Home() {
  const categories = getAllCategories();
  const brands = getAllBrands();
  const models = getAllModels();

  return (
    <div className="space-y-12">
      <div className="hero rounded-box border border-base-300 bg-gradient-to-br from-primary/15 via-base-100 to-base-200 shadow-lg">
        <div className="hero-content w-full max-w-none flex-col items-start px-6 py-10 text-left sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <div className="badge badge-primary badge-outline mb-3 font-medium">
              Bike knowledge
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              分类、品牌、型号与咨询，一站整理
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/80">
              本站用 Next.js App Router 搭建，所有条目来自项目根目录{" "}
              <kbd className="kbd kbd-sm">content/</kbd> 下的 Markdown（frontmatter +
              正文），直接编辑即可更新站点。
            </p>
          </div>
          <div className="card mt-8 w-full max-w-2xl border border-base-300 bg-base-100/95 shadow-md backdrop-blur-sm">
            <div className="card-body p-0">
              <div className="stats stats-vertical w-full divide-y divide-base-200 sm:stats-horizontal sm:divide-x sm:divide-y-0">
                <div className="stat place-items-center px-4 py-6 text-center sm:py-8">
                  <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    分类
                  </div>
                  <div className="stat-value text-primary tabular-nums">
                    {categories.length}
                  </div>
                  <div className="stat-desc max-w-[10rem] text-xs leading-snug">
                    车型大类
                  </div>
                </div>
                <div className="stat place-items-center px-4 py-6 text-center sm:py-8">
                  <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    品牌
                  </div>
                  <div className="stat-value text-primary tabular-nums">
                    {brands.length}
                  </div>
                  <div className="stat-desc max-w-[10rem] text-xs leading-snug">
                    整车厂牌
                  </div>
                </div>
                <div className="stat place-items-center px-4 py-6 text-center sm:py-8">
                  <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    型号
                  </div>
                  <div className="stat-value text-primary tabular-nums">
                    {models.length}
                  </div>
                  <div className="stat-desc max-w-[10rem] text-xs leading-snug">
                    车款条目
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-base-content">快速入口</h2>
        <CardGrid
          items={[
            {
              href: "/categories",
              title: "按车型分类",
              subtitle: "山地、公路、Gravel、通勤与电助力等说明与要点。",
            },
            {
              href: "/brands",
              title: "品牌索引",
              subtitle: "整车厂牌简介与官网入口。",
            },
            {
              href: "/models",
              title: "型号库",
              subtitle: "按品牌与分类筛选的代表车款条目。",
            },
            {
              href: "/consult",
              title: "咨询与问答",
              subtitle: "选购、保养与车型辨析的常见问题。",
            },
          ]}
        />
      </section>

      <div className="alert border border-dashed border-base-300 bg-base-100 shadow-sm">
        <span className="text-sm text-base-content/80">
          本地开发执行 <kbd className="kbd kbd-sm">npm run dev</kbd>
          ；静态构建执行 <kbd className="kbd kbd-sm">npm run build</kbd>（产物在{" "}
          <kbd className="kbd kbd-sm">out/</kbd>）。线上预览：{" "}
          <Link
            className="link link-primary font-medium"
            href="https://dao-ai.github.io/ai-bike/"
          >
            GitHub Pages
          </Link>
          。
        </span>
      </div>
    </div>
  );
}
