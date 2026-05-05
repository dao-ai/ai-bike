import Link from "next/link";
import { CardGrid } from "@/components/CardGrid";
import {
  getAllBrands,
  getAllCategories,
  getAllModels,
  getAllSeries,
} from "@/lib/content";

export default function Home() {
  const categories = getAllCategories();
  const brands = getAllBrands();
  const series = getAllSeries();
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
              分类、品牌、车系、车款与咨询，一站整理
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/80">
              查得到、比得明白：从分类、品牌到车系与车款，把选车常用的信息收在一处；内容会慢慢补全，值得你常回来看看。
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
                    车系
                  </div>
                  <div className="stat-value text-primary tabular-nums">
                    {series.length}
                  </div>
                  <div className="stat-desc max-w-[10rem] text-xs leading-snug">
                    产品线
                  </div>
                </div>
                <div className="stat place-items-center px-4 py-6 text-center sm:py-8">
                  <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    车款
                  </div>
                  <div className="stat-value text-primary tabular-nums">
                    {models.length}
                  </div>
                  <div className="stat-desc max-w-[10rem] text-xs leading-snug">
                    具体车型
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
              href: "/series",
              title: "车系浏览",
              subtitle: "按产品线（车系）进入，再查看旗下具体车款。",
            },
            {
              href: "/models",
              title: "车款库",
              subtitle: "筛选、关键词搜索，勾选最多三辆并排对比。",
            },
            {
              href: "/compare/",
              title: "车型对比",
              subtitle: "并排查看品牌、车系、年款与摘要；链接可分享给他人。",
            },
            {
              href: "/certificates/",
              title: "证书与许可",
              subtitle: "HTTPS 说明、MIT 开源许可全文与内容/商标声明。",
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
