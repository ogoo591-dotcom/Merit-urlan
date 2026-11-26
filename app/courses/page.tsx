import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { CourseCard } from "@/features/courses/components/course-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { CatalogSearchParams } from "@/features/catalog/catalog-params";
import { ListingView, parseListingParams } from "@/features/catalog/components/listing-view";
import { getCourseCatalog } from "@/server/services/courses/queries";
import { getPurchasedCourseIds } from "@/server/services/purchases/queries";

export const metadata: Metadata = { title: "Сургалт | Merit Urlan" };

const sortOptions = [
  { value: "default", label: "Санал болгох" },
  { value: "price_asc", label: "Үнэ: багаас их" },
  { value: "price_desc", label: "Үнэ: ихээс бага" },
  { value: "name", label: "Нэрээр (А–Я)" },
];

export default async function CoursesPage({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  // Ангилал нь сургалтын багц бүр (Хүүхдийн, Шинэ жилийн, Ороолт малгайны), түвшингээр шүүхгүй.
  const state = { ...parseListingParams(await searchParams, "package", sortOptions), level: [] };
  const { userId } = await auth();
  const [catalog, purchased] = await Promise.all([
    getCourseCatalog({ category: state.category, query: state.q, sort: state.sort, minPrice: state.min, maxPrice: state.max }),
    getPurchasedCourseIds(userId),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <ListingView
          base="/courses"
          title="Сургалт"
          description="Хүүхдийн, Шинэ жилийн, Ороолт малгайны гэсэн 3 сургалтын багц. Багц бүрийн 1-р хичээлийг үнэгүй үзэж болно."
          unit="сургалт"
          categoryParam="package"
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
