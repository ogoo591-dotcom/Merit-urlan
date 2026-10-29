import { GalleryGrid } from "@/components/gallery-grid";
import galleryImages from "@/lib/gallery-images.json";

// Нүүрэнд эхэлж гарах зургууд (raw-images доторх файлын нэрээр), эхнийх нь том нүдэнд.
// position — зураг тасрах үед аль хэсгийг нь харуулах; fit "contain" — зургийг бүтнээр нь харуулна.
const featured: Array<{ source: string; position?: string; fit?: "contain" }> = [
  { source: "19.jpg" },
  { source: "6.jpg" },
  { source: "14.jpg" },
  { source: "10.jpg" },
  { source: "13.jpg" },
  { source: "20.jpg", fit: "contain" },
];

const featuredImages = featured.flatMap((item) => {
  const image = galleryImages.find((entry) => entry.source === item.source);
  return image ? [{ ...image, ...item }] : [];
});
const orderedImages = [
  ...featuredImages,
  ...galleryImages.filter((image) => !featured.some((item) => item.source === image.source)),
];

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

        {/* Зургууд public/gallery-д байна. Шинэчлэх: raw-images-д зураг хийгээд `npm run compress`. */}
        <GalleryGrid images={orderedImages} />
      </div>
    </section>
  );
}
