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

export const mockCourses: MockCourse[] = [
  {
    id: "crochet-foundations",
    title: "Crochet Foundations",
    description:
      "Дэгээ барихаас эхлээд үндсэн хатгаас, тойрог нэхэх, хэмжээ тааруулах хүртэл анх удаа нэхэж буй хүнд зориулсан суурь сургалт.",
    price: 45000,
    coverSource: "3.jpg",
    level: "beginner",
    totalDuration: "2 цаг 10 мин",
    topics: ["basics"],
    outcomes: [
      "Дэгээ, утсаа зөв сонгож барих",
      "Гинж, багана, хагас багана хатгаас",
      "Тойрог (magic ring) нэхэх",
      "Схем уншиж, хэмжээгээ тааруулах",
    ],
    lessons: lessons([
      ["Дэгээ, утас сонгох", "12 мин"],
      ["Гинж хатгаас", "18 мин"],
      ["Багана, хагас багана", "25 мин"],
      ["Magic ring ба тойрог нэхэх", "30 мин"],
      ["Схем унших", "22 мин"],
      ["Анхны жижиг бүтээл", "23 мин"],
    ]),
  },
  {
    id: "amigurumi-studio",
    title: "Amigurumi Studio",
    description:
      "Толгой, бие, гар хөлийг тусад нь нэхэж, чихэж, угсран чихмэл тоглоом бүтээх алхамчилсан сургалт.",
    price: 65000,
    coverSource: "22.jpg",
    level: "intermediate",
    totalDuration: "3 цаг 05 мин",
    topics: ["amigurumi"],
    outcomes: [
      "Бөмбөрцөг, цилиндр хэлбэр нэхэх",
      "Чихэх, хэлбэр оруулах",
      "Хэсгүүдийг цэвэрхэн угсрах",
      "Нүүр царай хатгаж амилуулах",
    ],
    lessons: lessons([
      ["Amigurumi гэж юу вэ", "10 мин"],
      ["Толгой нэхэх", "35 мин"],
      ["Бие ба хөл", "40 мин"],
      ["Гар, чих", "30 мин"],
      ["Чихэх ба угсрах", "45 мин"],
      ["Нүүр царай хатгах", "25 мин"],
    ]),
  },
  {
    id: "market-collection-lab",
    title: "Market Collection Lab",
    description:
      "Гар урлалаа борлуулах түвшинд хүргэх: цуврал бүтээл төлөвлөх, өртгөө тооцох, зураг авах, захиалга авах.",
    price: 55000,
    coverSource: "8.jpg",
    level: "advanced",
    totalDuration: "1 цаг 50 мин",
    topics: ["business"],
    outcomes: [
      "Цуврал (collection) төлөвлөх",
      "Өртөг, үнэ тооцох",
      "Бүтээлээ гоё зурагдах",
      "Онлайнаар захиалга авах",
    ],
    lessons: lessons([
      ["Цуврал төлөвлөх", "20 мин"],
      ["Өртөг ба үнэ", "25 мин"],
      ["Бүтээлийн зураг авах", "30 мин"],
      ["Онлайн борлуулалт", "35 мин"],
    ]),
  },
  {
    id: "keychain",
    title: "Түлхүүрийн оосор хийх",
    description: "Хамгийн хурдан сурч болох жижиг бүтээл — өнгөлөг түлхүүрийн оосор хийж, бэлэг болгох эсвэл зарах.",
    price: 35000,
    coverSource: "16.jpg",
    level: "beginner",
    totalDuration: "1 цаг 15 мин",
    topics: ["amigurumi", "basics"],
    outcomes: [
      "Жижиг хэлбэр хурдан нэхэх",
      "Түлхүүрийн цагираг бэхлэх",
      "Тоо, үсэг хатгах",
      "Багцаар хийж борлуулах",
    ],
    lessons: lessons([
      ["Материал бэлтгэх", "8 мин"],
      ["Суурь хэлбэр нэхэх", "18 мин"],
      ["Тоо, үсэг хатгах", "20 мин"],
      ["Цагираг бэхлэх", "12 мин"],
      ["Багцаар хийх зөвлөгөө", "17 мин"],
    ]),
  },
];
