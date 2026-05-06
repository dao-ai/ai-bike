import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { MarkdownBody } from "@/components/MarkdownBody";

export const metadata: Metadata = {
  title: "更新日志",
  description: "自行车知识库站点与仓库的版本变更记录。",
};

export default function ChangelogPage() {
  const fp = path.join(process.cwd(), "CHANGELOG.md");
  const markdown = fs.readFileSync(fp, "utf8");

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-base-content">更新日志</h1>
        <p className="mt-2 text-sm text-base-content/70">
          源文件位于仓库根目录{" "}
          <a
            className="link link-primary"
            href="https://github.com/dao-ai/ai-bike/blob/master/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            CHANGELOG.md
          </a>
          ；发版流程见{" "}
          <a
            className="link link-primary"
            href="https://github.com/dao-ai/ai-bike/blob/master/RELEASING.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            RELEASING.md
          </a>
          。
        </p>
      </header>
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5 sm:p-6">
          <MarkdownBody markdown={markdown} />
        </div>
      </section>
    </article>
  );
}
