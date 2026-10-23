// Единый источник товаров. Страницы товаров генерируются отсюда (generateStaticParams).
// Цены, состав и рост модели — примерные значения для портфолио, замените на реальные.

export type Category = "tees" | "hoodies" | "longsleeves" | "accessories";
export type Size = "S" | "M" | "L" | "XL" | "ONE";
export type Angle = "front" | "back" | "profile" | "detail" | "flat" | "flat2" | "life";

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "tees", label: "Футболки" },
  { id: "hoodies", label: "Худи" },
  { id: "longsleeves", label: "Лонгсливы" },
  { id: "accessories", label: "Аксессуары" },
];

export const FABRICS = {
  milk: { name: "Молочный", hex: "#EFEBE3" },
  graphite: { name: "Графит", hex: "#3A3A37" },
  cobalt: { name: "Кобальт", hex: "#1E3FCC" },
  melange: { name: "Серый меланж", hex: "#A9A39A" },
} as const;
export type ColorId = keyof typeof FABRICS;

export type Variant = {
  color: ColorId;
  /** Ракурсы в порядке галереи */
  shots: Angle[];
  /** Недоступные размеры для этого цвета */
  soldOutSizes?: Size[];
};

export type Product = {
  slug: string;
  name: string;
  short: string;
  category: Category;
  price: number;
  idea: string;
  composition: string;
  care: string;
  model: string;
  sizes: Size[];
  variants: Variant[];
  soldOut?: boolean;
  fit: string;
};

export const SIZE_TABLE: Record<"tees" | "hoodies" | "longsleeves", [Size, number, number, string][]> = {
  tees: [["S", 108, 70, "160–170"], ["M", 114, 72, "170–178"], ["L", 120, 74, "178–186"], ["XL", 126, 76, "186–194"]],
  hoodies: [["S", 120, 68, "160–170"], ["M", 126, 70, "170–178"], ["L", 132, 72, "178–186"], ["XL", 138, 74, "186–194"]],
  longsleeves: [["S", 106, 70, "160–170"], ["M", 112, 72, "170–178"], ["L", 118, 74, "178–186"], ["XL", 124, 76, "186–194"]],
};

const APPAREL: Size[] = ["S", "M", "L", "XL"];
const FULL: Angle[] = ["front", "back", "detail", "profile", "flat"];

export const products: Product[] = [
  {
    slug: "hoodie-vne-plana",
    name: "Худи «Вне плана»",
    short: "Худи",
    category: "hoodies",
    price: 6900,
    idea: "Тихая надпись «ВНЕ ПЛАНА» и три точки на груди — как отметка, что маршрут ещё не построен. Посадка свободная, плечо спущено, карман-кенгуру.",
    composition: "100% хлопок, футер с начёсом, 380 г/м²",
    care: "30°, наизнанку, без отбеливания",
    model: "рост модели 172 см, размер M",
    sizes: APPAREL,
    fit: "Худи сшито свободно. Свой обычный размер — расслабленная посадка, на размер больше — oversize.",
    variants: [
      { color: "graphite", shots: [...FULL, "life"], soldOutSizes: ["XL"] },
      { color: "melange", shots: FULL },
    ],
  },
  {
    slug: "tee-marshrut",
    name: "Футболка «Маршрут»",
    short: "Футболка",
    category: "tees",
    price: 3400,
    idea: "Пунктирная линия маршрута, который никуда не ведёт, — на груди и вдоль спины. Плотный хлопок держит форму, длина чуть ниже пояса.",
    composition: "100% хлопок, кулирная гладь, 240 г/м²",
    care: "30°, наизнанку, без отбеливания",
    model: "рост модели 172 см, размер M",
    sizes: APPAREL,
    fit: "Прямой силуэт с небольшим запасом. Возьмите свой размер — сядет свободно, на размер больше — oversize.",
    variants: [
      { color: "milk", shots: FULL },
      { color: "graphite", shots: FULL },
      { color: "cobalt", shots: FULL, soldOutSizes: ["S"] },
    ],
  },
  {
    slug: "longsleeve-liniya",
    name: "Лонгслив «Линия»",
    short: "Лонгслив",
    category: "longsleeves",
    price: 4200,
    idea: "Одна непрерывная линия по рукаву — путь, нарисованный не глядя на карту. Для межсезонья и долгих прогулок.",
    composition: "100% хлопок, 220 г/м²",
    care: "30°, наизнанку, без отбеливания",
    model: "рост модели 172 см, размер M",
    sizes: APPAREL,
    fit: "Прямая посадка, удлинённый рукав с манжетой. Выбирайте свой обычный размер.",
    variants: [
      { color: "milk", shots: FULL },
      { color: "graphite", shots: FULL },
    ],
  },
  {
    slug: "tote-tochki",
    name: "Шоппер «Точки»",
    short: "Шоппер",
    category: "accessories",
    price: 1900,
    idea: "Три точки встречи на плотном канвасе. Помещается ноутбук, плёночная камера и всё, что подобрано по дороге.",
    composition: "100% хлопок, канвас 340 г/м²",
    care: "30°, без отжима",
    model: "размер 38 × 42 см, ручки 65 см",
    sizes: ["ONE"],
    fit: "Единый размер.",
    variants: [
      { color: "milk", shots: ["front", "flat", "detail", "flat2"] },
      { color: "graphite", shots: ["front", "flat", "detail", "flat2"] },
    ],
  },
  {
    slug: "tee-bez-adresa",
    name: "Футболка «Без адреса»",
    short: "Футболка",
    category: "tees",
    price: 3400,
    idea: "На спине — надпись для тех, у кого сегодня нет конкретного адреса. Спокойная спереди, разговорчивая сзади.",
    composition: "100% хлопок, кулирная гладь, 240 г/м²",
    care: "30°, наизнанку, без отбеливания",
    model: "рост модели 168 см, размер M",
    sizes: APPAREL,
    fit: "Прямой силуэт с небольшим запасом. Свой размер — свободно, на размер больше — oversize.",
    variants: [{ color: "milk", shots: ["back", "life", "detail", "flat"] }],
  },
  {
    slug: "cap-tochki",
    name: "Кепка «Точки»",
    short: "Кепка",
    category: "accessories",
    price: 2400,
    idea: "Шестипанельная кепка с вышитыми точками маршрута сбоку. Регулируется металлической пряжкой.",
    composition: "100% хлопок, твил",
    care: "Ручная стирка",
    model: "обхват 54–60 см",
    sizes: ["ONE"],
    soldOut: true,
    fit: "Единый размер, регулируется.",
    variants: [
      { color: "graphite", shots: ["front", "profile", "detail", "back", "flat"] },
      { color: "cobalt", shots: ["front", "profile", "detail", "back", "flat"] },
    ],
  },
];

export const ANGLE_LABEL: Record<Angle, string> = {
  front: "на модели спереди",
  back: "на модели сзади",
  profile: "на модели в профиль",
  detail: "деталь принта",
  flat: "предмет целиком",
  flat2: "предмет, второй ракурс",
  life: "в городе",
};

const FOLDER: Record<string, string> = {
  "hoodie-vne-plana": "hoodie",
  "tee-marshrut": "route-tee",
  "longsleeve-liniya": "line-longsleeve",
  "tote-tochki": "dots-tote",
  "tee-bez-adresa": "no-address-tee",
  "cap-tochki": "dots-cap",
};

export function img(slug: string, color: ColorId, angle: Angle) {
  return `/images/products/${FOLDER[slug]}/${color}-${angle}.jpg`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function cardImage(p: Product, color: ColorId) {
  return img(p.slug, color, p.slug === "tee-bez-adresa" ? "flat" : "flat");
}

export function hoverImage(p: Product, color: ColorId) {
  const v = p.variants.find((x) => x.color === color)!;
  const a = v.shots.find((s) => s === "front" || s === "back" || s === "life");
  return a ? img(p.slug, color, a) : undefined;
}

export const rub = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";

export const sizeLabel = (s: Size) => (s === "ONE" ? "Единый" : s);
