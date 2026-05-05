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
            className="card border border-base-300 bg-base-100 shadow-md transition-all duration-200 hover:border-primary/40 hover:shadow-xl"
          >
            <div className="card-body p-5 sm:p-6">
              <h2 className="card-title text-lg text-base-content">{item.title}</h2>
              {item.subtitle ? (
                <p className="text-sm leading-relaxed text-base-content/70">
                  {item.subtitle}
                </p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
