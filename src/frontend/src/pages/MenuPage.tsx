import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Flame } from "lucide-react";
import { motion } from "motion/react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDishes } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  type Dish,
  MENU_CATEGORIES,
  type MenuCategory,
} from "@/types";

const DISH_IMAGES: Record<string, string> = {
  "Couscous au poulet et légumes": "/assets/generated/couscous.dim_600x400.jpg",
  Merguez: "/assets/generated/merguez.dim_600x400.jpg",
  Madfouna: "/assets/generated/madfouna.dim_600x400.jpg",
  Spaghetti: "/assets/generated/spaghetti.dim_600x400.jpg",
  Saganáki: "/assets/generated/saganaki.dim_600x400.jpg",
  "Café turc": "/assets/generated/cafe-turc.dim_600x400.jpg",
};

const FALLBACK_IMAGE = "/assets/images/placeholder.svg";

function dishImage(dish: Dish): string {
  if (dish.imageRef) return dish.imageRef;
  return DISH_IMAGES[dish.name] ?? FALLBACK_IMAGE;
}

function formatPrice(priceDt: bigint): string {
  return `${Number(priceDt)} DT`;
}

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-lg"
    >
      <Link
        to="/menu/$dishId"
        params={{ dishId: String(dish.id) }}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        data-ocid={`menu.dish_card.${index}`}
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={dishImage(dish)}
            alt={dish.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {dish.popular ? (
            <Badge
              variant="secondary"
              className="absolute left-3 top-3 gap-1 border-transparent bg-accent/90 text-accent-foreground backdrop-blur-sm"
            >
              <Flame className="size-3" aria-hidden="true" />
              Populaire
            </Badge>
          ) : null}
          <span className="absolute bottom-3 right-3 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-md">
            {formatPrice(dish.priceDt)}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
            {dish.name}
          </h3>
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {dish.description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-foreground transition-smooth group-hover:gap-2.5">
            Voir le plat
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function DishCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card">
      <Skeleton className="aspect-[3/2] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { data: dishes = [], isLoading, isError } = useDishes();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { category?: string };

  const activeCategory: MenuCategory = MENU_CATEGORIES.some(
    (c) => c.value === search.category,
  )
    ? (search.category as MenuCategory)
    : "plats";

  const filteredDishes = dishes.filter(
    (dish) => dish.category === activeCategory,
  );

  const selectCategory = (category: MenuCategory) => {
    void navigate({
      search: { category } as never,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Notre carte"
        title="Le Menu"
        description="Découvrez nos plats populaires, boissons et desserts préparés avec des produits frais et des saveurs authentiques."
      />

      {/* Filtres de catégorie */}
      <div
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Filtrer le menu par catégorie"
      >
        {MENU_CATEGORIES.map((category) => {
          const isActive = category.value === activeCategory;
          return (
            <button
              key={category.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectCategory(category.value)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-accent/15 hover:text-foreground",
              )}
              data-ocid={`menu.filter.tab.${category.value}`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Grille de plats */}
      {isLoading ? (
        <div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="menu.loading_state"
        >
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((key) => (
            <DishCardSkeleton key={key} />
          ))}
        </div>
      ) : isError ? (
        <div
          className="mt-16 flex flex-col items-center gap-4 text-center"
          data-ocid="menu.error_state"
        >
          <p className="font-display text-2xl font-semibold text-foreground">
            Oups, une erreur est survenue
          </p>
          <p className="max-w-md text-muted-foreground">
            Nous n&apos;avons pas pu charger le menu. Veuillez réessayer dans un
            instant.
          </p>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div
          className="mt-16 flex flex-col items-center gap-4 text-center"
          data-ocid="menu.empty_state"
        >
          <p className="font-display text-2xl font-semibold text-foreground">
            Aucun plat dans cette catégorie
          </p>
          <p className="max-w-md text-muted-foreground">
            Nous préparons actuellement de nouvelles recettes pour la catégorie{" "}
            {CATEGORY_LABELS[activeCategory].toLowerCase()}.
          </p>
        </div>
      ) : (
        <div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="menu.dish_list"
        >
          {filteredDishes.map((dish, index) => (
            <DishCard key={dish.id.toString()} dish={dish} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
