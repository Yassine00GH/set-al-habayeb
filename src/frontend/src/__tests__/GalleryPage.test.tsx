import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import GalleryPage from "@/pages/GalleryPage";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: null, isFetching: false }),
}));

// The object-storage package's dist/blob subpath is not resolvable in the
// jsdom test environment. The gallery tests only exercise rendering, the
// lightbox, and category filtering — never the upload flow — so a stub for
// ExternalBlob is sufficient.
vi.mock("@caffeineai/object-storage", () => ({
  ExternalBlob: {
    fromBytes: () => ({
      withUploadProgress: () => ({}),
    }),
  },
}));

describe("GalleryPage", () => {
  it("renders the gallery heading and category filters", () => {
    render(<GalleryPage />);
    expect(
      screen.getByRole("heading", { name: /Nos photos/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tout" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Les plats" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Les desserts" }),
    ).toBeInTheDocument();
  });

  it("opens a fullscreen lightbox when an image is clicked", async () => {
    const user = userEvent.setup();
    render(<GalleryPage />);

    const firstImage = screen.getByRole("button", {
      name: /Notre salle baignée de lumière chaude/i,
    });
    await user.click(firstImage);

    const lightbox = screen.getByLabelText(/Visionneuse d'images/i);
    expect(lightbox).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Fermer la visionneuse/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 / 7")).toBeInTheDocument();
  });

  it("closes the lightbox via the close button", async () => {
    const user = userEvent.setup();
    render(<GalleryPage />);

    await user.click(
      screen.getByRole("button", {
        name: /Notre salle baignée de lumière chaude/i,
      }),
    );
    expect(screen.getByLabelText(/Visionneuse d'images/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Fermer la visionneuse/i }),
    );
    expect(
      screen.queryByLabelText(/Visionneuse d'images/i),
    ).not.toBeInTheDocument();
  });

  it("filters the gallery by category", async () => {
    const user = userEvent.setup();
    render(<GalleryPage />);

    await user.click(screen.getByRole("tab", { name: "Les desserts" }));
    expect(screen.getByText("Makrouds au miel et sésame")).toBeInTheDocument();
    expect(
      screen.queryByText("Couscous royal à l'agneau"),
    ).not.toBeInTheDocument();
  });
});
