export const menuCategories = ["All", "Coffee", "Non-Coffee", "Pastry"] as const;

export type MenuCategory = (typeof menuCategories)[number];
export type ProductCategory = Exclude<MenuCategory, "All">;

export type MenuProduct = {
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  available: boolean;
  image: {
    emoji: string;
    alt: string;
    tone: string;
  };
};

export const menuProducts: MenuProduct[] = [
  {
    name: "Cloudy Oat Latte",
    category: "Coffee",
    description: "Silky espresso with oat milk, brown sugar, and a whisper of sea salt.",
    price: 38000,
    available: true,
    image: { emoji: "☕", alt: "Illustration of a creamy iced oat latte", tone: "bg-[#e8c9a5]" },
  },
  {
    name: "Kopi Kita Latte",
    category: "Coffee",
    description: "Our house espresso made soft and comforting with velvety fresh milk.",
    price: 32000,
    available: true,
    image: { emoji: "🥛", alt: "Illustration of Kopi Kita signature latte", tone: "bg-[#c9966b]" },
  },
  {
    name: "Midnight Mocha",
    category: "Coffee",
    description: "Bold espresso, dark chocolate, and a little late-night main-character energy.",
    price: 40000,
    available: false,
    image: { emoji: "🍫", alt: "Illustration of a dark chocolate mocha", tone: "bg-[#a66a4a]" },
  },
  {
    name: "Orange Cold Brew",
    category: "Coffee",
    description: "Slow-steeped cold brew brightened with orange peel and a splash of tonic.",
    price: 42000,
    available: true,
    image: { emoji: "🍊", alt: "Illustration of citrus cold brew", tone: "bg-[#efb05a]" },
  },
  {
    name: "Strawberry Matcha",
    category: "Non-Coffee",
    description: "Ceremonial matcha layered over house strawberry milk for a berry-green glow.",
    price: 39000,
    available: true,
    image: { emoji: "🍓", alt: "Illustration of strawberry matcha latte", tone: "bg-[#e6b8a5]" },
  },
  {
    name: "Peach Please",
    category: "Non-Coffee",
    description: "Sparkling peach tea with jasmine, citrus, and sunny afternoon vibes.",
    price: 35000,
    available: true,
    image: { emoji: "🍑", alt: "Illustration of sparkling peach tea", tone: "bg-[#f2c9a5]" },
  },
  {
    name: "Butter Croissant",
    category: "Pastry",
    description: "Golden, flaky, and baked for the kind of morning worth getting up for.",
    price: 28000,
    available: true,
    image: { emoji: "🥐", alt: "Illustration of a golden butter croissant", tone: "bg-[#e9c887]" },
  },
  {
    name: "Choco Sea Salt Cookie",
    category: "Pastry",
    description: "A chewy dark chocolate cookie finished with delicate flakes of sea salt.",
    price: 25000,
    available: false,
    image: { emoji: "🍪", alt: "Illustration of a chocolate sea salt cookie", tone: "bg-[#bc8b6d]" },
  },
];
