import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { CourseCard } from "@/components/courses/course-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { CatalogSearchParams } from "@/components/store/catalog-params";
import { ListingView, parseListingParams } from "@/components/store/listing-view";
import { getCourseCatalog } from "@/lib/data/courses";
import { getPurchasedCourseIds } from "@/lib/data/purchases";

export const metadata: Metadata = { title: "Сургалт | Merit Urlan" };

const sortOptions = [
  { value: "default", label: "Санал болгох" },
  { value: "price_asc", label: "Үнэ: багаас их" },
  { value: "price_desc", label: "Үнэ: ихээс бага" },
  { value: "name", label: "Нэрээр (А–Я)" },
];

export default async function CoursesPage({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const state = parseListingParams(await searchParams, "topic", sortOptions);
  const { userId } = await auth();
  const [catalog, purchased] = await Promise.all([
    getCourseCatalog({ category: state.category, levels: state.level, query: state.q, sort: state.sort, minPrice: state.min, maxPrice: state.max }),
    getPurchasedCourseIds(userId),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <ListingView
          base="/courses"
          title="Сургалт"
          description="Видео хичээлээр алхам алхмаар сураарай. Сургалт бүрийн 1-р хичээлийг үнэгүй үзэж болно."
          unit="сургалт"
          categoryParam="topic"
          state={state}
          catalog={catalog}
          sortOptions={sortOptions}
        >
          {catalog.items.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} purchased={purchased.includes(course.id)} />
            </li>
          ))}
        </ListingView>
      </main>
      <SiteFooter />
    </>
  );
}
