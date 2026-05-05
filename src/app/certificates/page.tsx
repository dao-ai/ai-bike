import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "证书与许可",
  description: "传输安全说明、开源许可证全文，以及内容与商标声明。",
};

function readLicense(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), "LICENSE"), "utf8");
  } catch {
    return "（未在仓库根目录找到 LICENSE 文件。）";
  }
}

export default function CertificatesPage() {
  const licenseText = readLicense();

  return (
    <div className="space-y-10">
      <SectionTitle
        title="证书与许可"
        description="说明本站传输方式、开源代码授权，以及知识库内容与第三方品牌的边界。"
      />

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-5 sm:p-6">
          <h2 className="card-title text-base text-base-content">传输安全（HTTPS）</h2>
          <p className="text-sm leading-relaxed text-base-content/85">
            本站通过 <strong className="font-semibold text-base-content">HTTPS</strong>{" "}
            提供访问；TLS 证书由托管平台（如 GitHub Pages）自动签发与续期，浏览器地址栏应显示锁形图标。请勿在不可信网络下输入敏感个人信息。
          </p>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-5 sm:p-6">
          <h2 className="card-title text-base text-base-content">内容与商标</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-base-content/85">
            <li>
              知识库中的<strong className="text-base-content">文字与结构</strong>
              以仓库贡献与维护为准；转载或商用请自行确认授权与准确性。
            </li>
            <li>
              文中出现的<strong className="text-base-content">整车品牌、车系与型号名称</strong>
              均为各自权利人商标或商业标识，本站仅作索引与选型说明，不代表任何厂商背书。
            </li>
            <li>规格、几何与售价请以厂商与授权经销商公布为准。</li>
          </ul>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-5 sm:p-6">
          <h2 className="card-title text-base text-base-content">开源软件许可（MIT）</h2>
          <p className="text-sm text-base-content/80">
            本站工程代码以{" "}
            <strong className="font-medium text-base-content">MIT License</strong>{" "}
            授权，允许在保留版权声明与许可文本的前提下使用、复制与修改。全文如下（与仓库根目录{" "}
            <kbd className="kbd kbd-sm">LICENSE</kbd> 同步）：
          </p>
          <pre className="max-h-[28rem] overflow-auto rounded-box border border-base-300 bg-base-200/50 p-4 text-xs leading-relaxed text-base-content/90">
            {licenseText.trimEnd()}
          </pre>
        </div>
      </section>

      <p className="text-center text-sm text-base-content/60">
        <Link href="/" className="link link-primary">
          ← 返回首页
        </Link>
      </p>
    </div>
  );
}
