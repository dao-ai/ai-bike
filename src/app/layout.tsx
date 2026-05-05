import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "自行车知识库",
    template: "%s · 自行车知识库",
  },
  description: "山地、公路、Gravel 等分类，品牌与型号索引，以及骑行选购咨询（Markdown 内容源）。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-base-200 text-base-content antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <footer className="footer footer-center border-t border-base-300 bg-base-100 px-4 py-8 text-sm text-base-content/70">
          <aside className="max-w-2xl space-y-3 leading-relaxed">
            <p className="text-base text-base-content">
              <span className="badge badge-primary badge-outline mr-2 align-middle">
                AI 辅助开发
              </span>
              本站<strong className="font-semibold text-primary">主要界面与工程代码由人工智能自动辅助生成</strong>
              （Cursor 等 Agent / 对话式编程），在人工审阅与迭代中持续完善，并非传统纯手工从零撰写。
            </p>
            <p className="text-xs text-base-content/60">
              知识条目数据来自仓库{" "}
              <kbd className="kbd kbd-sm align-middle">content/</kbd>{" "}
              下 Markdown；技术栈：Next.js App Router、daisyUI、Tailwind CSS。
            </p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
