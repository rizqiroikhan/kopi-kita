export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "kopi" | "non-kopi" | "pastry";
  image: string;
  available: boolean;
};

export const menuItems: MenuItem[] = [
  { id: 1, name: "Kopi Susu Kita", description: "Espresso lembut dengan susu segar dan gula aren khas Kopi Kita.", price: 28000, category: "kopi", image: "/menu/coffee.svg", available: true },
  { id: 2, name: "Americano", description: "Espresso bersih dan bold untuk menemani hari yang penuh fokus.", price: 24000, category: "kopi", image: "/menu/coffee.svg", available: true },
  { id: 3, name: "Es Kopi Gula Aren", description: "Kopi susu dingin dengan manis gula aren yang hangat dan familiar.", price: 30000, category: "kopi", image: "/menu/coffee.svg", available: true },
  { id: 4, name: "Matcha Latte", description: "Matcha creamy yang earthy, ringan, dan dibuat untuk slow afternoons.", price: 35000, category: "non-kopi", image: "/menu/non-coffee.svg", available: true },
  { id: 5, name: "Coklat Panas", description: "Coklat hangat yang rich dan comforting dengan rasa yang tidak terlalu manis.", price: 30000, category: "non-kopi", image: "/menu/non-coffee.svg", available: true },
  { id: 6, name: "Croissant", description: "Croissant butter yang flaky dan fresh dari oven untuk teman ngopi.", price: 26000, category: "pastry", image: "/menu/pastry.svg", available: true },
  { id: 7, name: "Roti Bakar Keju", description: "Roti panggang renyah dengan keju lumer yang gurih dan nostalgic.", price: 25000, category: "pastry", image: "/menu/pastry.svg", available: true },
  { id: 8, name: "Banana Bread", description: "Banana bread moist dengan aroma rempah lembut untuk sore yang santai.", price: 28000, category: "pastry", image: "/menu/pastry.svg", available: false },
];

// Existing menu-page exports, derived from the source-of-truth data above.
export const menuCategories = ["All", "Coffee", "Non-Coffee", "Pastry"] as const;
export type MenuCategory = (typeof menuCategories)[number];
export type ProductCategory = Exclude<MenuCategory, "All">;

const categoryLabels: Record<MenuItem["category"], ProductCategory> = {
  kopi: "Coffee",
  "non-kopi": "Non-Coffee",
  pastry: "Pastry",
};

const artwork: Record<MenuItem["category"], { emoji: string; tone: string }> = {
  kopi: { emoji: "☕", tone: "bg-[#c9966b]" },
  "non-kopi": { emoji: "🥛", tone: "bg-[#e6b8a5]" },
  pastry: { emoji: "🥐", tone: "bg-[#e9c887]" },
};

export const menuProducts = menuItems.map((item) => ({
  name: item.name,
  category: categoryLabels[item.category],
  description: item.description,
  price: item.price,
  available: item.available,
  image: {
    emoji: artwork[item.category].emoji,
    alt: `Illustration of ${item.name}`,
    tone: artwork[item.category].tone,
  },
}));
