import Link from "next/link";

import { CategoryCard } from "@/components/category-card";
import { FeaturedCourseCard } from "@/components/featured-course-card";
import { ShopHero } from "@/components/shop-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { homeCategories, homeFeaturedCourses, homeStats, shopCategoryMeta } from "@/lib/site-data";

export default function HomePage() {
  const homeHero = shopCategoryMeta.supplies;

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fbf7f6] text-stone-900">
        <ShopHero
          meta={homeHero}
          stats={homeStats}
          illustration="supplies"
        />

        <section className="bg-[#f5edef] px-6 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1800px]">
            <div className="max-w-3xl">
              <h2 className="text-5xl font-bold tracking-tight text-[#2e1b28] lg:text-6xl">
                Юу хайж байна вэ?
              </h2>
              <p className="mt-4 text-2xl text-[#a27b84]">
                Таны хэрэгцээнд тохирсон бүтээгдэхүүнийг олоорой
              </p>
            </div>

            <div className="mt-12 grid gap-6 xl:grid-cols-4">
              {homeCategories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  description={category.description}
                  href={category.href}
                  icon={category.icon}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1800px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-5xl font-bold tracking-tight text-[#2e1b28] lg:text-6xl">
                  Онцлох сургалтууд
                </h2>
                <p className="mt-4 text-2xl text-[#a27b84]">
                  Мэргэжлийн багш нарын боловсруулсан агуулга
                </p>
              </div>
              <Link
                href="/courses"
                className="text-2xl font-semibold text-[#bf4d61] transition hover:text-[#a83d52]"
              >
                Бүгдийг харах →
              </Link>
            </div>

            <div className="mt-14 grid gap-8 xl:grid-cols-3">
              {homeFeaturedCourses.map((course) => (
                <FeaturedCourseCard
                  key={course.title}
                  category={course.category}
                  lessons={course.lessons}
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  tint={course.tint}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
