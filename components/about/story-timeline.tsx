import { aboutTimeline } from "@/lib/mock/about";

// Бидний түүх: босоо шугамтай timeline. Том дэлгэц дээр картууд ээлжлэн зүүн, баруун талд байрлана.
export function StoryTimeline() {
  return (
    <section id="story" className="scroll-mt-[var(--header-h,130px)] bg-white px-6 py-20 lg:px-[144px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">Бидний түүх</p>
          <h2 className="mt-5 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">Бяцхан хоббигоос брэнд хүртэл</h2>
        </div>

        <ol className="relative mt-14 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-[#ecd3d9] lg:before:left-1/2">
          {aboutTimeline.map((event, index) => {
            const right = index % 2 === 1;
            return (
              <li key={`${event.year}-${event.title}`} className="relative pb-10 pl-14 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0">
                <span
                  aria-hidden
                  className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#a24456] text-[11px] font-semibold text-white shadow-[0_0_0_1px_#ecd3d9] lg:left-1/2 lg:-translate-x-1/2"
                >
                  {index + 1}
                </span>
                <div className={right ? "lg:col-start-2" : "lg:text-right"}>
                  <div className="rounded-[24px] border border-[#efe4da] bg-[#fcf6f0] p-6 lg:p-7">
                    <p className="font-serif text-[28px] leading-none text-[#a24456]">{event.year}</p>
                    <h3 className="mt-3 text-[13px] font-semibold text-[#2f2420]">{event.title}</h3>
                    <p className="mt-2 text-[12px] leading-[1.9] text-[#7a6b63]">{event.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
