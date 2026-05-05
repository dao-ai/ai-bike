import Link from "next/link";
import { BicycleIcon } from "@/components/BicycleIcon";

const nav = [
  { href: "/categories", label: "分类" },
  { href: "/brands", label: "品牌" },
  { href: "/models", label: "车款" },
  { href: "/compare/", label: "对比" },
  { href: "/consult", label: "咨询" },
  { href: "/certificates/", label: "证书" },
];

export function SiteHeader() {
  return (
    <header className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/90 shadow-sm backdrop-blur-md">
      <div className="navbar mx-auto w-full max-w-5xl px-2 sm:px-4">
        <div className="flex-1">
          <Link
            href="/"
            className="btn btn-ghost gap-2 px-2 text-lg font-semibold normal-case text-primary sm:px-3"
          >
            <BicycleIcon className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <span className="truncate">自行车知识库</span>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal gap-0 px-0 sm:gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="btn btn-ghost btn-sm px-2 font-medium sm:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
