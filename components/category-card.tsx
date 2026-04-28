import Link from "next/link";

type CategoryCardProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export function CategoryCard({ title, description, href, icon }: CategoryCardProps) {
  return (
    <article className="rounded-[2rem] border border-[#e4d2d3] bg-white p-8 shadow-[0_18px_40px_-28px_rgba(90,41,52,0.28)]">
      <div className="mb-8 text-4xl text-[#bc566b]">{icon}</div>
      <h3 className="text-[1.95rem] font-semibold leading-tight text-[#31202b]">{title}</h3>
      <p className="mt-4 text-lg leading-8 text-[#a27b84]">{description}</p>
      <Link
        href={href}
        className="mt-8 inline-flex items-center gap-3 text-xl font-semibold text-[#bf4d61] transition hover:gap-4"
      >
        Үзэх <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
