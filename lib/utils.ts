export function plural(n: number, forms: [string, string, string]) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

export const models = (n: number) => `${n} ${plural(n, ["модель", "модели", "моделей"])}`;
export const combos = (n: number) => `${n} ${plural(n, ["сочетание", "сочетания", "сочетаний"])}`;
export const pieces = (n: number) => `${n} ${plural(n, ["вещь", "вещи", "вещей"])}`;
export const items = (n: number) => `${n} ${plural(n, ["товар", "товара", "товаров"])}`;

export const LAST_CATALOG_KEY = "vne-plana:last-catalog";
