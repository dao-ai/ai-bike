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
        <footer className="footer footer-center border-t border-base-300 bg-base-100 p-6 text-sm text-base-content/60">
          <aside>
            <p>内容源：content/**/*.md · Next.js App Router · daisyUI</p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
