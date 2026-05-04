import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">页面未找到</h1>
      <p className="mt-2 text-[var(--muted)]">链接可能已失效，或条目尚未录入。</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
      >
        返回首页
      </Link>
    </div>
  );
}
