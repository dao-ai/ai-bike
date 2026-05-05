import Link from "next/link";
import { BicycleIcon } from "@/components/BicycleIcon";

const nav = [
  { href: "/categories", label: "分类" },
  { href: "/brands", label: "品牌" },
  { href: "/models", label: "型号" },
  { href: "/consult", label: "咨询" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--edge)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[var(--accent)] sm:gap-2.5 sm:text-base"
        >
          <BicycleIcon className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
          <span>自行车知识库</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] sm:px-3"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
