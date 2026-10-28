import { CroppedPhoto } from "@/components/cropped-photo";

function ImageIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 17 4.5-4 3.5 3 3-2.5 5 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const photos = [
  { caption: "Бугын тоглоом", tag: "Онцлох", focus: "48% 42%", zoom: 1.9, tile: "md:col-span-2 md:row-span-2" },
  { caption: "Зөгий", tag: "Чихмэл", focus: "69% 58%", zoom: 2.6, tile: "md:col-span-1" },
  { caption: "Улаан даашинзтай туулай", tag: "Чихмэл", focus: "14% 58%", zoom: 2.6, tile: "md:col-span-1" },
  { caption: "Гахай", tag: "Чихмэл", focus: "25% 55%", zoom: 2.8, tile: "md:col-span-1" },
  { caption: "Анааш", tag: "Чихмэл", focus: "37% 58%", zoom: 2.8, tile: "md:col-span-1" },
  { caption: "Туулайн гэр бүл", tag: "Чихмэл", focus: "86% 58%", zoom: 2, tile: "md:col-span-1" },
] as const;

export function GallerySection() {
  return (
    <section id="gallery" className="screen-section bg-[#3d302c] px-6 py-10 lg:px-[180px]">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a8786b]">Зургийн цомог</p>
            <h2 className="mt-5 font-serif text-[40px] leading-tight text-white lg:text-[48px]">Зургийн цомог</h2>
          </div>
          <p className="max-w-[620px] text-[12px] leading-[1.9] text-[#b8aaa2] lg:pb-3">
            Бидний гараар урласан бүтээлүүдээс. Бүтээл бүр өөрийн гэсэн зан төлөвтэй.
          </p>
        </div>

        <div className="mt-6 grid auto-rows-[220px] gap-4 md:grid-cols-3 lg:h-[calc(100svh-var(--header-h,130px)-230px)] lg:grid-rows-3">
          {photos.map((photo) => (
            <figure
              key={photo.caption}
              className={`group relative overflow-hidden rounded-[24px] ${photo.tile}`}
            >
              <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
                <CroppedPhoto
                  alt={photo.caption}
                  focus={photo.focus}
                  zoom={photo.zoom}
                  sizes="(max-width: 768px) 90vw, 60vw"
                  className="h-full w-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
              <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-[#2f2420]/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur">
                {photo.tag}
              </span>
              <figcaption className="absolute bottom-6 left-6 flex items-center gap-2.5 text-[12px] text-white">
                <ImageIcon />
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
