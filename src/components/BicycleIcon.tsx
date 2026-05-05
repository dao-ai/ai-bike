type Props = {
  className?: string;
};

/** 侧视自行车线框图标，随 `currentColor` / `text-*` 变色 */
export function BicycleIcon({ className = "h-8 w-8" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={true}
    >
      <circle
        cx="6.25"
        cy="16"
        r="3.35"
        stroke="currentColor"
        strokeWidth="1.65"
      />
      <circle
        cx="17.75"
        cy="16"
        r="3.35"
        stroke="currentColor"
        strokeWidth="1.65"
      />
      <path
        d="M6.25 16 11.2 9.2 17.75 16M11.2 9.2 12.8 5.8M11.2 9.2 8.8 13.5M12.8 5.8l3.4 1.1M8.8 13.5h7.8"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
