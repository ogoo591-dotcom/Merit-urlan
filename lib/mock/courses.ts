import "server-only";

// Сургалтын mock өгөгдөл. videoUrl-ууд энд байгаа тул энэ файлыг зөвхөн сервер импортолно
// ("server-only" — client component-оос импортолбол build алдаа өгнө). Үнэ, текст түр утга.

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type MockLesson = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isFree: boolean;
};

export type MockCourse = {
  id: string;
  title: string;
  description: string;
  price: number;
  // raw-images доторх файлын нэр (gallery-images.json-оос олно).
  coverSource: string;
  // Сургалтын хуудасны нэмэлт зургууд (coverSource-ын дараа харагдана).
  gallerySources?: string[];
  level: CourseLevel;
  totalDuration: string;
  topics: string[];
  outcomes: string[];
  lessons: MockLesson[];
};

// Жишээ видео (MDN-ийн CC0 лицензтэй). Жинхэнэ хичээлийн бичлэгээр солино.
const sampleA = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const sampleB = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4";

const lessons = (titles: Array<[string, string]>): MockLesson[] =>
  titles.map(([title, duration], index) => ({
    id: `l${index + 1}`,
    title,
    duration,
    videoUrl: index % 2 === 0 ? sampleA : sampleB,
    isFree: index === 0,
  }));

// Сайтын 3 сургалтын багц. Түвшнээр (анхан/дунд/ахисан) ангилахгүй — level талбар зөвхөн админд үлдсэн.
// Нүүр зураг түр — "Ороолт малгайны багц"-ийн жинхэнэ зургийг raw-images-д нэмээд coverSource-ийг солино.
export const mockCourses: MockCourse[] = [
  {
    id: "kids-set",
    title: "Хүүхдийн багц",
    description:
      "Нярай, бага насны хүүхдэд зориулсан гутал, шажигнуур, малгай, жижиг тоглоомыг алхам алхмаар нэхэж сурна. Бэлэг болгоход хамгийн тохиромжтой багц.",
    price: 55000,
    coverSource: "2.jpg",
    gallerySources: ["21.jpg", "6.jpg"],
    level: "beginner",
    totalDuration: "2 цаг 40 мин",
    topics: ["kids"],
    outcomes: [
      "Хүүхдэд аюулгүй утас, материал сонгох",
      "Нярайн гутал нэхэх",
      "Модон цагирагтай шажигнуур тоглоом хийх",
      "Хүүхдийн малгай, жижиг amigurumi тоглоом нэхэх",
    ],
    lessons: lessons([
      ["Утас, материал сонгох", "12 мин"],
      ["Нярайн гутал", "35 мин"],
      ["Шажигнуур тоглоом", "30 мин"],
      ["Хүүхдийн малгай", "28 мин"],
      ["Жижиг amigurumi тоглоом", "35 мин"],
      ["Угсрах ба аюулгүй байдал", "20 мин"],
    ]),
  },
  {
    id: "new-year-set",
    title: "Шинэ жилийн багц",
    description:
      "Цасан хүн, Өвлийн өвгөн, гацуурын чимэглэл зэрэг шинэ жилийн бүтээлүүдийг нэхэж, баярын бэлэг, чимэглэл болгоно.",
    price: 55000,
    coverSource: "15.jpg",
    gallerySources: ["27.jpg"],
    level: "beginner",
    totalDuration: "2 цаг 50 мин",
    topics: ["new-year"],
    outcomes: [
      "Цасан хүн, Өвлийн өвгөн тоглоом нэхэх",
      "Гацуурын жижиг чимэглэл хийх",
      "Малгай, ороолт зэрэг жижиг деталь нэмэх",
      "Бүтээлээ бэлэг болгон боох",
    ],
    lessons: lessons([
      ["Материал бэлтгэх", "10 мин"],
      ["Цасан хүн", "40 мин"],
      ["Өвлийн өвгөн", "40 мин"],
      ["Гацуурын чимэглэл", "30 мин"],
      ["Цагаан гаатай хүн", "30 мин"],
      ["Бэлэг болгон боох", "20 мин"],
    ]),
  },
  {
    id: "scarf-hat-set",
    title: "Ороолт малгайны багц",
    description:
      "Толгойн хэмжээ авахаас эхлээд малгай, помпон, ороолт нэхэж, өвлийн иж бүрдэл бүтээх хүртэл алхам алхмаар заана.",
    price: 55000,
    coverSource: "27.jpg",
    gallerySources: [],
    level: "beginner",
    totalDuration: "2 цаг 30 мин",
    topics: ["scarf-hat"],
    outcomes: [
      "Толгойн хэмжээ авч, тооцоо хийх",
      "Резинэн хатгаас нэхэх",
      "Малгай, помпон хийх",
      "Ороолт нэхэж иж бүрдэл болгох",
    ],
    lessons: lessons([
      ["Утас сонгох, хэмжээ авах", "15 мин"],
      ["Резинэн хатгаас", "25 мин"],
      ["Энгийн малгай", "40 мин"],
      ["Помпон хийх", "15 мин"],
      ["Ороолт", "35 мин"],
      ["Иж бүрдэл болгох", "20 мин"],
    ]),
  },
];
