type FeaturedCourseCardProps = {
  category: string;
  lessons: string;
  title: string;
  description: string;
  price: string;
  tint: string;
};

export function FeaturedCourseCard({
  category,
  lessons,
  title,
  description,
  price,
  tint,
}: FeaturedCourseCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#e7d2d0] bg-white shadow-[0_20px_45px_-35px_rgba(90,41,52,0.28)]">
      <div
        className="flex h-80 flex-col items-center justify-center gap-5 border-b border-[#ead8d6]"
        style={{ backgroundColor: tint }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/5 text-4xl text-[#b6adab]">
          ◍
        </div>
        <p className="text-2xl uppercase tracking-[0.22em] text-[#b6adab]">{category}</p>
      </div>

      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-[#f5d9de] px-4 py-2 text-lg font-semibold text-[#bc576a]">
            {category}
          </span>
          <span className="text-lg text-[#a27b84]">{lessons}</span>
        </div>

        <div className="space-y-4">
          <h3 className="text-[2.05rem] font-semibold leading-tight text-[#31202b]">{title}</h3>
          <p className="text-lg leading-8 text-[#9e7981]">{description}</p>
        </div>

        <p className="text-[2.15rem] font-bold text-[#b7475d]">{price}</p>
      </div>
    </article>
  );
}
