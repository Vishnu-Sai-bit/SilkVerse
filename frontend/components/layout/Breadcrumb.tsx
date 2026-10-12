import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({
  items,
}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className="mb-8 text-sm text-gray-500"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isCurrent =
            index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center"
            >
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition hover:text-[#7A1F2B] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-medium text-[#7A1F2B]"
                  aria-current={
                    isCurrent ? "page" : undefined
                  }
                >
                  {item.label}
                </span>
              )}

              {!isCurrent && (
                <span
                  className="mx-2"
                  aria-hidden="true"
                >
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}