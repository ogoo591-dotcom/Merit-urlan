type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-stone-500">{eyebrow}</p>
      <h2 className="font-serif text-[32px] leading-tight text-stone-900 sm:text-[40px]">{title}</h2>
      <p className="text-[12px] leading-7 text-stone-600">{description}</p>
    </div>
  );
}
