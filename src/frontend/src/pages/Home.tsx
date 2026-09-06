import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Leaf,
  MapPin,
  Quote,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { useDishes } from "@/hooks/useQueries";
import type { Dish } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const REVIEWS = [
  {
    name: "Amira B.",
    text: "Un accueil chaleureux dès la porte. On se sent comme à la maison, et le couscous est tout simplement divin.",
    highlight: "accueil chaleureux",
  },
  {
    name: "Karim T.",
    text: "Très attentifs aux allergies : ils ont adapté mon plat sans gluten avec le sourire. Une attention rare qui fait toute la différence.",
    highlight: "attention aux allergies",
  },
  {
    name: "Sonia M.",
    text: "L'ambiance près de la médina est magique, les saveurs authentiques et le service impeccable. Une adresse à ne pas manquer.",
    highlight: "ambiance près de la médina",
  },
];

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
    <motion.li variants={fadeUp} className="h-full">
      <Link
        to="/menu/$dishId"
        params={{ dishId: String(dish.id) }}
        className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-lg"
        data-ocid={`home_dish_card.${index + 1}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={dishImage(dish)}
            alt={dish.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {dish.popular ? (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
              <Sparkles className="size-3" aria-hidden="true" />
              Populaire
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              {dish.name}
            </h3>
            <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {formatPrice(dish.priceDt)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {dish.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-accent-foreground transition-smooth group-hover:gap-2.5">
            Voir le plat
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function HomePage() {
  const { data: dishes, isLoading } = useDishes();
  const popularDishes = (dishes ?? [])
    .filter((dish) => dish.popular)
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 grain opacity-60"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-10 size-80 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/3 top-1/3 size-40 rounded-full bg-secondary/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 md:grid-cols-2 md:pt-24 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-start gap-6"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground"
            >
              <MapPin className="size-3.5" aria-hidden="true" />
              Au cœur de la médina de Tunis
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              La Saveur
              <br />
              de <span className="text-gradient-warm italic">Tunis</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-md text-lg leading-relaxed text-muted-foreground"
            >
              Une cuisine tunisienne authentique, préparée avec passion et
              servie dans une ambiance chaleureuse, à deux pas des ruelles de la
              médina.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full"
                data-ocid="home_hero_menu_button"
              >
                <Link to="/menu">
                  Découvrir le menu
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full"
                data-ocid="home_hero_about_button"
              >
                <a href="#a-propos">Notre histoire</a>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-2 flex items-center gap-6 border-t border-border pt-6"
            >
              <div className="flex flex-col">
                <span className="font-display text-2xl font-semibold text-foreground">
                  4,9/5
                </span>
                <span className="text-xs text-muted-foreground">
                  1 051 avis
                </span>
              </div>
              <div className="h-10 w-px bg-border" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-semibold text-foreground">
                  20+
                </span>
                <span className="text-xs text-muted-foreground">
                  ans de savoir-faire
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="arch relative overflow-hidden border-4 border-card shadow-2xl">
              <img
                src="/assets/generated/hero-dish.dim_900x1100.jpg"
                alt="Plat gourmet de couscous tunisien garni de viande braisée et de légumes, servi sur une nappe en lin près d'un verre de thé à la menthe"
                className="aspect-[9/11] w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 grain opacity-40"
                aria-hidden="true"
              />
            </div>
            <div
              className="absolute -bottom-6 -left-6 -z-10 size-40 rounded-full bg-accent/30 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute -right-8 -top-8 -z-10 size-32 rounded-full bg-secondary/40 blur-2xl"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </section>

      {/* ===== À propos ===== */}
      <section
        id="a-propos"
        className="relative bg-muted/40 py-24"
        data-ocid="home_about_section"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="flex flex-col items-start gap-5"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground"
            >
              <UtensilsCrossed className="size-3.5" aria-hidden="true" />
              Notre histoire
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
            >
              Une table familiale
              <br />
              <span className="text-gradient-warm italic">
                près de la médina
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Niché dans une ruelle paisible de la médina de Tunis, Set Al
              Habayeb perpétue depuis plus de vingt ans les recettes transmises
              de génération en génération. Chaque plat raconte une histoire :
              les épices du souk, la douceur du safran, la générosité de l'huile
              d'olive.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="max-w-lg text-base leading-relaxed text-muted-foreground"
            >
              Dans une ambiance feutrée aux murs de terre cuite, nous vous
              accueillons comme des invités de la famille — avec le sourire,
              l'attention aux détails et le respect de chacun, y compris de vos
              allergies et régimes particuliers.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[
                { icon: Leaf, label: "Produits frais du marché" },
                { icon: Sparkles, label: "Recettes de famille" },
                { icon: MapPin, label: "Au cœur de la médina" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
                >
                  <item.icon
                    className="size-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {item.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[1.25rem] border border-border shadow-subtle">
              <img
                src="/assets/generated/hero-dish.dim_900x1100.jpg"
                alt="Vue d'ensemble de la salle chaleureuse du restaurant aux murs de terre cuite"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-lg sm:block">
              <p className="font-display text-3xl font-semibold text-gradient-warm">
                20+
              </p>
              <p className="text-xs text-muted-foreground">
                ans de savoir-faire
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Menu preview ===== */}
      <section className="relative py-24" data-ocid="home_menu_section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <SectionHeading
              eyebrow="Nos spécialités"
              title="Les plats préférés"
              description="Une sélection de nos plats les plus appréciés, préparés avec des produits frais du marché."
            />
          </motion.div>

          {isLoading ? (
            <div
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              data-ocid="home_menu_loading"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-[1.25rem] border border-border bg-muted"
                />
              ))}
            </div>
          ) : popularDishes.length > 0 ? (
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              data-ocid="home_menu_list"
            >
              {popularDishes.map((dish, index) => (
                <DishCard key={dish.id} dish={dish} index={index} />
              ))}
            </motion.ul>
          ) : (
            <div
              className="mt-12 flex flex-col items-center gap-3 rounded-[1.25rem] border border-dashed border-border bg-muted/40 px-6 py-16 text-center"
              data-ocid="home_menu_empty"
            >
              <UtensilsCrossed
                className="size-10 text-accent"
                aria-hidden="true"
              />
              <p className="font-display text-xl font-semibold text-foreground">
                Le menu arrive bientôt
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Nos plats populaires seront bientôt disponibles ici. En
                attendant, découvrez toute notre carte.
              </p>
              <Button
                asChild
                className="mt-2 rounded-full"
                data-ocid="home_menu_empty_button"
              >
                <Link to="/menu">Voir le menu complet</Link>
              </Button>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="rounded-full"
              data-ocid="home_menu_all_button"
            >
              <Link to="/menu">
                Voir tout le menu
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Avis ===== */}
      <section
        className="relative bg-muted/40 py-24"
        data-ocid="home_reviews_section"
      >
        <div
          className="pointer-events-none absolute inset-0 grain opacity-40"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="flex flex-col items-center gap-6 text-center"
          >
            <SectionHeading
              eyebrow="Ils nous font confiance"
              title="Ce que disent nos clients"
            />
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-8 py-6 shadow-subtle"
            >
              <div
                className="flex items-center gap-1"
                aria-label="Note de 4,9 sur 5"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="size-5 fill-accent text-accent"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="font-display text-4xl font-semibold text-foreground">
                4,9/5
              </p>
              <p className="text-sm text-muted-foreground">
                Basé sur 1 051 avis clients
              </p>
            </motion.div>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-12 grid gap-6 md:grid-cols-3"
            data-ocid="home_reviews_list"
          >
            {REVIEWS.map((review, index) => (
              <motion.li
                key={review.name}
                variants={fadeUp}
                className="flex h-full flex-col gap-4 rounded-[1.25rem] border border-border bg-card p-6 shadow-subtle"
                data-ocid={`home_review.${index + 1}`}
              >
                <Quote className="size-8 text-accent/60" aria-hidden="true" />
                <p className="flex-1 text-sm leading-relaxed text-foreground">
                  « {review.text} »
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent/15 font-display text-sm font-semibold text-accent-foreground">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {review.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Client vérifié
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ===== Horaires banner ===== */}
      <section className="relative py-16" data-ocid="home_hours_section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6 rounded-[1.25rem] border border-border bg-gradient-warm px-6 py-10 text-center text-primary-foreground shadow-lg md:flex-row md:justify-between md:text-left"
          >
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
                <Clock className="size-4" aria-hidden="true" />
                Nos horaires
              </span>
              <p className="font-display text-2xl font-semibold md:text-3xl">
                Ouvert tous les jours dès 09:00
              </p>
              <p className="text-sm text-primary-foreground/80">
                Fermé le dimanche — réservez votre table pour une expérience
                inoubliable.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full"
              data-ocid="home_hours_reserve_button"
            >
              <Link to="/reservation">
                Réserver une table
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
