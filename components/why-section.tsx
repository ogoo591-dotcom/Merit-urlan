function GemIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M7 4.5h10l3.5 5L12 20 3.5 9.5 7 4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.5 9.5h17M9.5 4.5 8 9.5l4 10.5 4-10.5-1.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5 19 6v5.5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6l7-2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="3.5" y="14" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="16.5" y="14" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const reasons = [
  {
    title: "Гараар урласан чанар",
    description: "Бүтээл бүрийг нэг бүрчлэн гараар, нарийн анхааралтай нэхэж бэлтгэдэг.",
    tag: "100% гар урлал",
    icon: GemIcon,
  },
  {
    title: "Аюулгүй материал",
    description: "Хүүхдэд ээлтэй, зөөлөн, удаан эдэлгээтэй утас, дүүргэгч ашигладаг.",
    tag: "Хүүхдэд ээлтэй",
    icon: ShieldIcon,
  },
  {
    title: "Тусламж, зөвлөгөө",
    description: "Сургалтын явцад гарсан асуултад тань бид шууд хариулж, зөвлөж өгнө.",
    tag: "Шуурхай хариу",
    icon: HeadphonesIcon,
  },
] as const;

export function WhySection() {
  return (
    <section id="why" className="screen-section relative overflow-hidden bg-[#f8eae7] px-6 py-10 lg:px-[180px]">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[#efd9d6] opacity-70 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1600px]">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">Бидний давуу тал</p>
          <h2 className="mt-5 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">
            Яагаад биднийг сонгох вэ?
          </h2>
          <p className="mt-6 text-[12px] leading-[1.9] text-[#7a6b63]">
            Бид бүтээл бүртээ сэтгэлээ зориулж, үйлчлүүлэгч бүрт дулаан, найдвартай туршлагыг
            бэлэглэхийг эрмэлздэг.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="rounded-[32px] border border-[#f1e4da] bg-[#fdf6ee] p-8 shadow-[0_24px_50px_-40px_rgba(70,45,35,0.5)] transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#efe0da] bg-[#f6e8e6] text-[#2f2420]">
                    <Icon />
                  </span>
                  <span className="text-[11px] text-[#b8aaa2]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 text-[12px] font-semibold text-[#2f2420]">{reason.title}</h3>
                <p className="mt-5 text-[12px] leading-[1.9] text-[#7a6b63]">{reason.description}</p>
                <span className="mt-8 inline-block rounded-full bg-[#f4e5e3] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6e4f45]">
                  {reason.tag}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
