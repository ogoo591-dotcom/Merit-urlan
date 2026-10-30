import { aboutStats } from "@/lib/mock/about";

export function AboutStats() {
  return (
    <section id="stats" aria-label="Тоон үзүүлэлт" className="bg-[#3d302c] px-6 py-14 lg:px-[144px]">
      <dl className="mx-auto grid w-full max-w-[1200px] gap-10 text-center sm:grid-cols-3">
        {aboutStats.map((stat) => (
          <div key={stat.label} className="sm:border-l sm:border-white/10 sm:first:border-0">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-serif text-[48px] leading-none text-white lg:text-[56px]">{stat.value}</span>
              <span className="mt-3 block text-[12px] uppercase tracking-[0.15em] text-[#b8aaa2]">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
