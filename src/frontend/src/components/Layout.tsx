import { Link, Outlet } from "@tanstack/react-router";
import { Clock, MapPin, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Galerie", to: "/galerie" },
  { label: "Réservation", to: "/reservation" },
] as const;

const RESTAURANT = {
  name: "Set Al Habayeb",
  address: "16 Rue Boukhrissan, Tunis 1000",
  phone: "22 060 729",
  phoneHref: "tel:+21622060729",
};

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground"
            data-ocid="header_logo"
          >
            <span className="text-gradient-warm">Set Al Habayeb</span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigation principale"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-accent/10 hover:text-foreground"
                activeProps={{ className: "bg-accent/15 text-foreground" }}
                data-ocid={`nav_${link.to.replace("/", "")}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              className="hidden rounded-full md:inline-flex"
              data-ocid="header_reserve_button"
            >
              <Link to="/reservation">Réserver</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              data-ocid="mobile_menu_toggle"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            className="border-t border-border bg-card px-4 py-4 md:hidden"
            aria-label="Navigation mobile"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-smooth hover:bg-accent/10"
                    onClick={() => setMenuOpen(false)}
                    data-ocid={`mobile_nav_${link.to.replace("/", "")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex flex-col gap-3">
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
              <span className="text-gradient-warm">Set Al Habayeb</span>
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Cuisine tunisienne authentique et chaleureuse, au cœur de Tunis.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Coordonnées
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{RESTAURANT.address}</span>
              </li>
              <li>
                <a
                  href={RESTAURANT.phoneHref}
                  className="flex items-center gap-2 transition-smooth hover:text-foreground"
                  data-ocid="footer_phone_link"
                >
                  <Phone
                    className="size-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {RESTAURANT.phone}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              Horaires
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock
                  className="size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>Ouvert tous les jours dès 09:00</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock
                  className="size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>Fermé le dimanche</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()}. Tous droits réservés — Set Al
              Habayeb.
            </p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="transition-smooth hover:text-foreground"
              data-ocid="footer_attribution"
            >
              Conçu avec ❤️ via caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
