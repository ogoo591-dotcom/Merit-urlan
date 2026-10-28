import { CroppedPhoto } from "@/components/cropped-photo";

const eyebrowClass = "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]";

const strengths = [
  {
    title: "100% гар урлал",
    description: "Бүтээл бүрийг нэг бүрчлэн гараар, анхааралтай нэхэж бэлтгэдэг.",
  },
  {
    title: "Чанартай, аюулгүй материал",
    description: "Хүүхдэд ээлтэй, зөөлөн, удаан эдэлгээтэй утас, материал ашигладаг.",
  },
  {
    title: "Захиалгат бүтээл",
    description: "Өнгө, хэмжээ, загварыг таны хүсэлтээр тусгайлан урлаж өгнө.",
  },
] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      className="screen-section relative overflow-hidden bg-[#fcf6f0] bg-[radial-gradient(#efe2d7_1px,transparent_1px)] [background-size:28px_28px] text-[#2f2420]"
    >
      <div className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#f6dfe3] opacity-60 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1600px] px-6 py-10 lg:px-[144px]">
        <div className="flex flex-col gap-6 border-b border-[#e9ddd2] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={eyebrowClass}>Бизнесийн танилцуулга</p>
            <h2 className="mt-5 font-serif text-[40px] leading-tight lg:text-[48px]">Бидний тухай</h2>
          </div>
          <p className="max-w-[580px] text-[12px] leading-[1.8] text-[#7a6b63] lg:pb-3">
            Гараар, хайраар, сэтгэлээ шингээн урласан бүтээл бүр өөрийн гэсэн түүхтэй.
          </p>
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="relative self-start pb-10">
            <CroppedPhoto
              alt="Merit Urlan-ы гараар урласан бугын тоглоом"
              focus="48% 45%"
              zoom={1.8}
              sizes="(max-width: 1024px) 90vw, 720px"
              className="aspect-[4/5] rounded-[36px] lg:aspect-auto lg:h-[calc(100svh-var(--header-h,130px)-280px)]"
            />
            <span className="absolute bottom-16 left-6 rounded-full bg-[#2f2420]/75 px-5 py-2.5 text-[11px] text-white backdrop-blur">
              Merit урлан · Улаанбаатар
            </span>

            <div className="absolute -right-4 bottom-0 w-[min(20rem,80%)] rounded-2xl border border-[#efe4da] bg-[#fdf8f3] p-7 shadow-[0_24px_50px_-28px_rgba(70,45,35,0.45)] lg:-right-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4a3b35]">
                Тэмдэглэл
              </p>
              <p className="mt-3 text-[12px] leading-[1.9] text-[#7a6b63]">
                Бүтээл бүрт урласан хүний дулаан сэтгэл шингэсэн байдаг.
              </p>
            </div>
          </div>

          <div>
            <p className={eyebrowClass}>Танилцуулга</p>
            <h3 className="mt-3 text-[12px] font-semibold leading-[1.5]">
              Merit урлан нь гараар нэхсэн тоглоом, нэхмэлийн материал болон сургалтыг гар
              урлалд дуртай хүн бүрт хүргэдэг.
            </h3>
            <p className="mt-4 text-[12px] leading-[2.1] text-[#7a6b63]">
              Бид өхөөрдөм чихмэл тоглоом, бэлэг дурсгалын бүтээлүүдийг гараар урлахаас гадна
              өөрөө урлаж сурахыг хүссэн хүмүүст чанартай утас, туслах материал, алхамчилсан
              видео сургалтыг санал болгодог.
            </p>

            <div className="mt-6 rounded-3xl border border-[#ecdcdc] bg-[#f6eaea] p-6 lg:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6e4f45]">
                Бидний эрхэм зорилго
              </p>
              <blockquote className="mt-3 text-[12px] font-medium leading-[1.85] text-[#3a2b25]">
                “Дор бүрнээ онцгой түүх, сэтгэлийн дулаан мэдрэмж агуулсан цорын ганц
                бүтээлүүдээр дамжуулан хүмүүсийн өдөр тутмын амьдралд баяр баясгалан, гоо
                сайхныг нэмнэ.”
              </blockquote>
            </div>

            <div className="mt-6">
              <p className={eyebrowClass}>Бидний давуу тал</p>
              <ul className="mt-3 border-t border-[#e9ddd2]">
                {strengths.map((item, index) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#e9ddd2] py-3"
                  >
                    <span className="font-serif text-[12px] text-[#c9a99b]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-[#2f2420]">{item.title}</p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-[#7a6b63]">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
