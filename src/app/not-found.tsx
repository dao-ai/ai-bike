import Link from "next/link";

export default function NotFound() {
  return (
    <div className="hero min-h-[40vh] py-12">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="font-mono text-6xl font-bold text-primary">404</h1>
          <p className="py-6 text-base-content/70">页面未找到。链接可能已失效，或条目尚未录入。</p>
          <Link href="/" className="btn btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
