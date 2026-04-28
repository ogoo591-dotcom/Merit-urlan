import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
  active?: boolean;
};

type ShopBreadcrumbProps = {
  crumbs: Crumb[];
};

export function ShopBreadcrumb({ crumbs }: ShopBreadcrumbProps) {
  return (
    <div className="border-y border-[#e7e8ea] bg-[#f4f5f7]">
      <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center gap-3 px-6 py-5 text-xl lg:px-12 lg:text-[2rem]">
        {crumbs.map((crumb, index) => (
          <div key={`${crumb.label}-${index}`} className="flex items-center gap-3">
            {crumb.href ? (
              <Link
                href={crumb.href}
                className={
                  crumb.active
                    ? "font-medium text-[#ff9800]"
                    : "text-[#ff9800] transition hover:text-[#e18700]"
                }
              >
                {index === 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">⌂</span>
                    <span>{crumb.label.replace(/^⌂\s*/, "")}</span>
                  </span>
                ) : (
                  crumb.label
                )}
              </Link>
            ) : (
              <span className="font-medium text-[#707b86]">{crumb.label}</span>
            )}
            {index < crumbs.length - 1 ? <span className="text-[#666]">/</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
