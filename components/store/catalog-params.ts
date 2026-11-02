// Жагсаалтын хуудсуудын URL параметр уншигчид.

export type Param = string | string[] | undefined;
export type CatalogSearchParams = Record<string, Param>;

export const list = (value: Param) => (Array.isArray(value) ? value : value ? [value] : []).flatMap((item) => item.split(",")).filter(Boolean);
export const single = (value: Param) => (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
export const price = (value: Param) => {
  const number = Number(single(value));
  return Number.isFinite(number) && number >= 0 && single(value) !== undefined ? Math.floor(number) : undefined;
};
