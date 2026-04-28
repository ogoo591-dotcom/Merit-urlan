type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">{eyebrow}</p>
      <h2 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-stone-600">{description}</p>
    </div>
  );
}
