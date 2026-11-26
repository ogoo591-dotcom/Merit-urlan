// Хуучин URL (?lesson=l1 г.м.) DB-ийн uuid баганад алдаа өгөхөөс сэргийлнэ.
export const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
