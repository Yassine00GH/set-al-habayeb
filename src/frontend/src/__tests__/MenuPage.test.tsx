import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MenuPage from "@/pages/MenuPage";
import type { Dish, DishCategory } from "@/types";

const dishes: Dish[] = [
  {
    id: 1n,
    name: "Couscous au poulet et légumes",
    description: "Couscous traditionnel tunisien.",
    category: "plats" as DishCategory,
    priceDt: 45n,
    imageRef: "",
    popular: true,
    tags: ["plat"],
  },
  {
    id: 2n,
    name: "Café turc",
    description: "Café turc préparé à la manière traditionnelle.",
    category: "boissons" as DishCategory,
    priceDt: 20n,
    imageRef: "",
    popular: true,
    tags: ["boisson"],
  },
  {
    id: 3n,
    name: "Makroudh",
    description: "Pâtisserie au miel et au sésame.",
    category: "desserts" as DishCategory,
    priceDt: 22n,
    imageRef: "",
    popular: false,
    tags: ["dessert"],
  },
];

const navigateMock = vi.fn();
let searchMock: { category?: string } = {};

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
  useNavigate: () => navigateMock,
  useSearch: () => searchMock,
}));

vi.mock("@/hooks/useQueries", () => ({
  useDishes: () => ({ data: dishes, isLoading: false, isError: false }),
  useDish: () => ({ data: undefined, isLoading: false, isError: false }),
  useCreateReservation: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
  useReservations: () => ({ data: [], isLoading: false }),
}));

describe("MenuPage", () => {
  beforeEach(() => {
    searchMock = {};
    navigateMock.mockClear();
  });

  it("renders the menu heading and category filters", () => {
    render(<MenuPage />);
    expect(
      screen.getByRole("heading", { name: /Le Menu/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Plats" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Boissons" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Desserts" })).toBeInTheDocument();
  });

  it("shows only plats by default", () => {
    render(<MenuPage />);
    expect(
      screen.getByText("Couscous au poulet et légumes"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Café turc")).not.toBeInTheDocument();
    expect(screen.queryByText("Makroudh")).not.toBeInTheDocument();
  });

  it("navigates with the selected category in the URL when a filter is clicked", async () => {
    const user = userEvent.setup();
    render(<MenuPage />);

    await user.click(screen.getByRole("tab", { name: "Boissons" }));
    expect(navigateMock).toHaveBeenCalledWith({
      search: { category: "boissons" },
    });
  });

  it("filters dishes by the category read from the URL", () => {
    searchMock = { category: "boissons" };
    render(<MenuPage />);
    expect(screen.getByText("Café turc")).toBeInTheDocument();
    expect(
      screen.queryByText("Couscous au poulet et légumes"),
    ).not.toBeInTheDocument();
  });

  it("links each dish card to its detail page", () => {
    render(<MenuPage />);
    const couscousLink = screen.getByRole("link", {
      name: /Couscous au poulet et légumes/i,
    });
    expect(couscousLink).toHaveAttribute("href", "/menu/1");
  });
});
