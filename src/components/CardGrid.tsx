import Link from "next/link";

export function CardGrid({
  items,
}: {
  items: { href: string; title: string; subtitle?: string }[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block h-full rounded-xl border border-[var(--edge)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[var(--accent)]/40 hover:shadow-md"
          >
            <h2 className="text-lg font-medium text-[var(--foreground)]">
              {item.title}
            </h2>
            {item.subtitle ? (
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.subtitle}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
