import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/pages/Home";
import type { Dish, DishCategory } from "@/types";

const dishes: Dish[] = [
  {
    id: 1n,
    name: "Couscous au poulet et légumes",
    description: "Couscous traditionnel tunisien accompagné de poulet tendre.",
    category: "plats" as DishCategory,
    priceDt: 45n,
    imageRef: "",
    popular: true,
    tags: ["plat", "traditionnel"],
  },
  {
    id: 2n,
    name: "Merguez",
    description: "Saucisses épicées grillées au feu de bois.",
    category: "plats" as DishCategory,
    priceDt: 25n,
    imageRef: "",
    popular: true,
    tags: ["plat", "grillade"],
  },
  {
    id: 3n,
    name: "Madfouna",
    description: "Spécialité berbère cuite au four traditionnel.",
    category: "plats" as DishCategory,
    priceDt: 35n,
    imageRef: "",
    popular: true,
    tags: ["plat", "spécialité"],
  },
  {
    id: 4n,
    name: "Spaghetti",
    description: "Spaghetti al dente nappés d'une sauce tomate maison.",
    category: "plats" as DishCategory,
    priceDt: 30n,
    imageRef: "",
    popular: false,
    tags: ["plat", "pâtes"],
  },
];

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    children,
    ...rest
  }: {
    to: string;
    params?: Record<string, string>;
    children: React.ReactNode;
  }) => {
    let href = to;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        href = href.replace(`$${key}`, value);
      }
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

vi.mock("@/hooks/useQueries", () => ({
  useDishes: () => ({ data: dishes, isLoading: false }),
  useDish: () => ({ data: undefined, isLoading: false, isError: false }),
  useCreateReservation: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
  useReservations: () => ({ data: [], isLoading: false }),
}));

describe("HomePage", () => {
  it("renders the hero and restaurant identity without a blank screen", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: /La Saveur de Tunis/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Au cœur de la médina de Tunis/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Set Al Habayeb/i)).toBeInTheDocument();
  });

  it("shows the 4,9/5 rating and 1 051 avis", () => {
    render(<HomePage />);
    // The rating appears in both the hero and the reviews section
    expect(screen.getAllByText("4,9/5").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("1 051 avis")).toBeInTheDocument();
    expect(
      screen.getByText(/Basé sur 1 051 avis clients/i),
    ).toBeInTheDocument();
  });

  it("shows the hours banner: fermé le dimanche, ouvre à 09:00", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Ouvert tous les jours dès 09:00/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Fermé le dimanche/i)).toBeInTheDocument();
  });

  it("renders the popular dishes with prices in DT", () => {
    render(<HomePage />);
    expect(
      screen.getByText("Couscous au poulet et légumes"),
    ).toBeInTheDocument();
    expect(screen.getByText("Merguez")).toBeInTheDocument();
    expect(screen.getByText("Madfouna")).toBeInTheDocument();
    // Non-popular dish must not appear in the preview
    expect(screen.queryByText("Spaghetti")).not.toBeInTheDocument();
    expect(screen.getByText("45 DT")).toBeInTheDocument();
    expect(screen.getByText("25 DT")).toBeInTheDocument();
  });

  it("links each popular dish card to its detail page", () => {
    render(<HomePage />);
    const couscousLink = screen.getByRole("link", {
      name: /Couscous au poulet et légumes/i,
    });
    expect(couscousLink).toHaveAttribute("href", "/menu/1");
    const merguezLink = screen.getByRole("link", { name: /Merguez/i });
    expect(merguezLink).toHaveAttribute("href", "/menu/2");
  });

  it("renders the about section and authentic client reviews", () => {
    render(<HomePage />);
    expect(screen.getByText(/Une table familiale/i)).toBeInTheDocument();
    expect(screen.getByText(/Amira B\./i)).toBeInTheDocument();
    expect(screen.getByText(/Karim T\./i)).toBeInTheDocument();
    expect(screen.getByText(/Sonia M\./i)).toBeInTheDocument();
  });
});
