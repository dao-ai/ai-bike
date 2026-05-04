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
    <div className="space-y-14">
      <section className="rounded-2xl border border-[var(--edge)] bg-[var(--surface)] p-8 shadow-sm sm:p-10">
        <p className="text-sm font-medium text-[var(--accent)]">Bike knowledge</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          分类、品牌、型号与咨询，一站整理
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          本站用 Next.js App Router 搭建，所有条目来自项目根目录{" "}
          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-sm">
            content/
          </code>{" "}
          下的 Markdown（frontmatter + 正文），直接编辑即可更新站点。
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[var(--surface-2)] px-4 py-3">
            <dt className="text-xs text-[var(--muted)]">分类</dt>
            <dd className="text-2xl font-semibold tabular-nums">
              {categories.length}
            </dd>
          </div>
          <div className="rounded-lg bg-[var(--surface-2)] px-4 py-3">
            <dt className="text-xs text-[var(--muted)]">品牌</dt>
            <dd className="text-2xl font-semibold tabular-nums">{brands.length}</dd>
          </div>
          <div className="rounded-lg bg-[var(--surface-2)] px-4 py-3">
            <dt className="text-xs text-[var(--muted)]">型号</dt>
            <dd className="text-2xl font-semibold tabular-nums">{models.length}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">快速入口</h2>
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

      <section className="rounded-xl border border-dashed border-[var(--edge)] p-6 text-sm text-[var(--muted)]">
        <p>
          本地开发：在项目目录执行{" "}
          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[var(--foreground)]">
            npm run dev
          </code>
          。部署可选用{" "}
          <Link
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            href="https://vercel.com/docs/frameworks/nextjs"
          >
            Vercel
          </Link>{" "}
          或其他支持 Next.js 的平台。
        </p>
      </section>
    </div>
  );
}
