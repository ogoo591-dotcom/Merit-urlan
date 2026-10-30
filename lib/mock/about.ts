// "Бидний тухай" хуудасны текст. [ ] доторх болон XXXX гэсэн утгуудыг жинхэнэ мэдээллээр солино.

export const aboutHero = {
  eyebrow: "Бидний тухай",
  title: "Merit урлан",
  tagline: "Гараар, хайраар, сэтгэлээ шингээн урласан бүтээл бүр өөрийн гэсэн түүхтэй.",
  description:
    "Facebook групп дээрээс эхэлсэн бяцхан хобби өнөөдөр мянга мянган хүнийг гар урлалтай холбосон Merit урлан болон өргөжлөө.",
  // raw-images доторх файлын нэр (npm run compress-ийн дараа ч зөв зургаа олно).
  imageSource: "1.jpg",
};

export type TimelineEvent = { year: string; title: string; text: string };

export const aboutTimeline: TimelineEvent[] = [
  {
    year: "[2020]",
    title: "Facebook групп нээгдэв",
    text: "[Гар урлалд дуртай хүмүүстэй бүтээлээ хуваалцах зорилгоор Facebook групп нээж, анхны бүтээлүүдээ байршуулсан.]",
  },
  {
    year: "[2020]",
    title: "Анхны захиалга",
    text: "[Группын гишүүдээс анхны захиалга ирж, гараар нэхсэн тоглоомоо анх удаа худалдсан.]",
  },
  {
    year: "[2022]",
    title: "Сургалт эхлэв",
    text: "[Өөрөө нэхэж сурахыг хүссэн гишүүдэд зориулж алхамчилсан заавар, сургалт зохион байгуулж эхэлсэн.]",
  },
  {
    year: "[2026]",
    title: "Вэбсайт нээгдэв",
    text: "[Захиалга, сургалт, схемээ нэг дороос онлайнаар авах боломжтой Merit урлангийн вэбсайт нээгдэв.]",
  },
];

export const aboutStats = [
  { value: "5+", label: "жил" },
  { value: "XXXX+", label: "захиалга" },
  { value: "XXXX+", label: "группын гишүүн" },
];

export const aboutContact = {
  phone: "+976 9912 9445",
  phoneHref: "tel:+97699129445",
  // TODO: Facebook группын жинхэнэ линкээр солино (одоогоор Facebook хуудас руу заана).
  facebookGroup: "https://www.facebook.com/meriturlan",
  messenger: "https://m.me/meriturlan",
  address: "Улаанбаатар хот, БГД, 11-р хороо, Богд арын 813-32 тоот",
};
