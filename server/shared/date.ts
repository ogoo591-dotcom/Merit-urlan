// Огноог Улаанбаатарын цагаар (UTC+8) "YYYY-MM-DD" болгох ба буцаах (md_order.ready_by нь date багана).
const ubOffsetMs = 8 * 60 * 60 * 1000;

export const toUbDate = (date: Date) => new Date(date.getTime() + ubOffsetMs).toISOString().slice(0, 10);

// Тухайн өдрийн Улаанбаатарын 12:00 (types-ийн ISO мөр).
export const fromUbDate = (day: string) => new Date(`${day}T12:00:00+08:00`).toISOString();
