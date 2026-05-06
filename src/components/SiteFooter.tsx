import Link from "next/link";
import { SITE_VERSION } from "@/lib/siteVersion";

export function SiteFooter() {
  return (
    <footer className="footer footer-center border-t border-base-300 bg-base-100 px-4 py-8 text-sm text-base-content/70">
      <aside className="max-w-2xl space-y-3 leading-relaxed">
        <p className="text-base text-base-content">
          <span className="badge badge-primary badge-outline mr-2 align-middle">AI 辅助开发</span>
          本站<strong className="font-semibold text-primary">主要界面与工程代码由人工智能自动辅助生成</strong>
          （Cursor 等 Agent / 对话式编程），在人工审阅与迭代中持续完善，并非传统纯手工从零撰写。
        </p>
        <p className="text-xs text-base-content/60">
          知识条目数据来自仓库 <kbd className="kbd kbd-sm align-middle">content/</kbd> 下 Markdown；技术栈：Next.js App
          Router、daisyUI、Tailwind CSS。
        </p>
        <p className="text-xs text-base-content/60">
          <Link href="/certificates/" className="link link-primary font-medium">
            证书与许可
          </Link>
          <span className="mx-2 text-base-content/40">·</span>
          <Link href="/changelog/" className="link link-primary font-medium">
            更新日志
          </Link>
          <span className="mx-2 text-base-content/40">·</span>
          <span>HTTPS 加密访问</span>
          <span className="mx-2 text-base-content/40">·</span>
          <span>工程代码 MIT 开源</span>
        </p>
        <p className="text-xs tabular-nums text-base-content/50">
          版本 <span className="font-medium text-base-content/70">v{SITE_VERSION}</span>
        </p>
      </aside>
    </footer>
  );
}
