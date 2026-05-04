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
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-[var(--edge)] py-6 text-center text-xs text-[var(--muted)]">
          内容源：content/**/*.md · Next.js App Router
        </footer>
      </body>
    </html>
  );
}
