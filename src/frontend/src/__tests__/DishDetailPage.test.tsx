import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DishDetailPage from "@/pages/DishDetailPage";
import type { Dish, DishCategory } from "@/types";

const dish: Dish = {
  id: 1n,
  name: "Couscous au poulet et légumes",
  description: "Couscous traditionnel tunisien accompagné de poulet tendre.",
  category: "plats" as DishCategory,
  priceDt: 45n,
  imageRef: "",
  popular: true,
  tags: ["plat", "traditionnel", "couscous"],
};

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
  useParams: () => ({ dishId: "1" }),
}));

vi.mock("@/hooks/useQueries", () => ({
  useDishes: () => ({ data: [], isLoading: false, isError: false }),
  useDish: () => ({ data: dish, isLoading: false, isError: false }),
  useCreateReservation: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
  useReservations: () => ({ data: [], isLoading: false }),
}));

describe("DishDetailPage", () => {
  it("renders the dish name, description, category, tags and price", () => {
    render(<DishDetailPage />);
    expect(
      screen.getByRole("heading", { name: "Couscous au poulet et légumes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Couscous traditionnel tunisien accompagné de poulet tendre/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Plats")).toBeInTheDocument();
    expect(screen.getByText("traditionnel")).toBeInTheDocument();
    expect(screen.getByText("45 DT")).toBeInTheDocument();
  });

  it("links back to the menu and to the reservation page", () => {
    render(<DishDetailPage />);
    expect(
      screen.getByRole("link", { name: /Retour au menu/i }),
    ).toHaveAttribute("href", "/menu");
    expect(
      screen.getByRole("link", { name: /Réserver une table/i }),
    ).toHaveAttribute("href", "/reservation");
  });
});
