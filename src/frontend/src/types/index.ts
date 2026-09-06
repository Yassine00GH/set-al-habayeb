import type {
  Dish as BackendDish,
  DishCategory as BackendDishCategory,
  Reservation as BackendReservation,
} from "@/backend";

export type DishCategory = BackendDishCategory;
export type Dish = BackendDish;
export type Reservation = BackendReservation;

export type MenuCategory = "plats" | "boissons" | "desserts";

export const MENU_CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: "plats", label: "Plats" },
  { value: "boissons", label: "Boissons" },
  { value: "desserts", label: "Desserts" },
];

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  plats: "Plats",
  boissons: "Boissons",
  desserts: "Desserts",
};
