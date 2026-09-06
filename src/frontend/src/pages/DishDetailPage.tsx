import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CalendarCheck, Flame, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDish } from "@/hooks/useQueries";
import { CATEGORY_LABELS, type Dish, type DishCategory } from "@/types";

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
  return `${Number(priceDt).toLocaleString("fr-FR")} DT`;
}

export default function DishDetailPage() {
  const { dishId } = useParams({ from: "/menu/$dishId" });

  const id = (() => {
    try {
      return BigInt(dishId);
    } catch {
      return undefined;
    }
  })();

  const { data: dish, isLoading, isError } = useDish(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div
          className="grid gap-10 lg:grid-cols-2 lg:gap-16"
          data-ocid="dish_loading_state"
        >
          <div className="aspect-[4/5] w-full animate-pulse rounded-[1.5rem] bg-muted" />
          <div className="flex flex-col gap-6">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-3/4 animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !dish) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
        <div
          className="mb-6 flex size-16 items-center justify-center rounded-full bg-accent/15"
          aria-hidden="true"
        >
          <UtensilsCrossed className="size-8 text-accent" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Plat introuvable
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Ce plat n&apos;existe pas ou n&apos;est plus disponible sur notre
          carte. Découvrez nos autres spécialités tunisiennes.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 rounded-full"
          data-ocid="dish_not_found_back_button"
        >
          <Link to="/menu">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour au menu
          </Link>
        </Button>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[dish.category as DishCategory];

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Link
        to="/menu"
        className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
        data-ocid="dish_back_link"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Retour au menu
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="arch overflow-hidden bg-muted shadow-subtle">
            <img
              src={dishImage(dish)}
              alt={dish.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {dish.popular ? (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground shadow-subtle">
              <Flame className="size-3.5" aria-hidden="true" />
              Populaire
            </span>
          ) : null}
        </div>

        <div className="flex flex-col justify-center gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
            <span
              className="size-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            {categoryLabel}
          </span>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            {dish.name}
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            {dish.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {dish.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-6 border-t border-border pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Prix
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-gradient-warm">
                {formatPrice(dish.priceDt)}
              </p>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="mt-2 w-fit rounded-full px-8"
            data-ocid="dish_reserve_button"
          >
            <Link to="/reservation">
              <CalendarCheck className="size-4" aria-hidden="true" />
              Réserver une table
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
