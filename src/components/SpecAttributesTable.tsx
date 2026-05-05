/** 美利达 bikefinder 式「部位 / 配置」规格行（由 Markdown frontmatter 的 specAttributes 驱动） */
export function SpecAttributesTable({
  items,
  title = "规格明细",
}: {
  items: { label: string; value: string }[];
  title?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="not-prose max-w-none">
      <h3 className="mb-3 border-b border-base-300 pb-2 text-sm font-bold uppercase tracking-wide text-base-content/70">
        {title}
      </h3>
      <dl className="divide-y divide-base-300 rounded-box border border-base-300 bg-base-100">
        {items.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:gap-6 sm:py-2.5"
          >
            <dt className="shrink-0 text-sm font-semibold text-base-content sm:w-40 sm:pt-0.5">
              {row.label}
            </dt>
            <dd className="min-w-0 flex-1 text-sm leading-relaxed text-base-content/85">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
