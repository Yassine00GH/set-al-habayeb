import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ReservationPage from "@/pages/ReservationPage";

const mutateMock = vi.fn();

vi.mock("@/hooks/useQueries", () => ({
  useDishes: () => ({ data: [], isLoading: false, isError: false }),
  useDish: () => ({ data: undefined, isLoading: false, isError: false }),
  useCreateReservation: () => ({
    mutate: mutateMock,
    isPending: false,
    isError: false,
  }),
  useReservations: () => ({ data: [], isLoading: false }),
}));

// Radix Select does not interact reliably under jsdom (opening the trigger
// hangs the pointer-event flow), so render the reservation form's two selects
// as native <select> elements. This keeps the test focused on the form's
// validation and confirmation behavior rather than Radix's internal mechanics.
vi.mock("@/components/ui/select", () => {
  const _React = require("react");
  const Select = ({ value, onValueChange, children }: any) => (
    <select
      value={value ?? ""}
      onChange={(e: any) => onValueChange?.(e.target.value)}
      data-testid="mock-select"
    >
      {children}
    </select>
  );
  const SelectTrigger = ({ children }: any) => <>{children}</>;
  const SelectValue = ({ placeholder }: any) => <>{placeholder}</>;
  const SelectContent = ({ children }: any) => <>{children}</>;
  const SelectItem = ({ value, children }: any) => (
    <option value={value}>{children}</option>
  );
  return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
});

describe("ReservationPage", () => {
  it("renders the reservation form and contact details", () => {
    render(<ReservationPage />);
    expect(
      screen.getByRole("heading", { name: /Réserver une table/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    // The address appears in both the contact card and the static map
    expect(
      screen.getAllByText("16 Rue Boukhrissan, Tunis 1000").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("22 060 729")).toBeInTheDocument();
    expect(screen.getByText(/Fermé le dimanche/i)).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<ReservationPage />);

    await user.click(
      screen.getByRole("button", { name: /Confirmer la réservation/i }),
    );

    expect(
      screen.getByText("Veuillez indiquer votre nom."),
    ).toBeInTheDocument();
    expect(screen.getByText("Veuillez choisir une date.")).toBeInTheDocument();
    expect(screen.getByText("Veuillez choisir une heure.")).toBeInTheDocument();
    expect(
      screen.getByText("Veuillez indiquer le nombre de personnes."),
    ).toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("submits a valid reservation and shows a visual confirmation", async () => {
    const user = userEvent.setup();
    mutateMock.mockImplementation((_input, { onSuccess }) => {
      onSuccess();
    });

    render(<ReservationPage />);

    await user.type(screen.getByLabelText(/Nom complet/i), "Amira B.");

    const dateInput = screen.getByLabelText(/Date/i);
    await user.type(dateInput, "2026-09-20");

    // The two native selects render in component order: time first, party size
    // second.
    const selects = screen.getAllByTestId("mock-select");
    await user.selectOptions(selects[0], "20:00");
    await user.selectOptions(selects[1], "2");

    await user.click(
      screen.getByRole("button", { name: /Confirmer la réservation/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Demande envoyée !")).toBeInTheDocument();
    });
    // The form is reset on success, so the confirmation greets the generic
    // "pour votre demande" rather than the submitted name.
    expect(screen.getByText(/Merci pour votre demande !/i)).toBeInTheDocument();

    expect(mutateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Amira B.",
        date: "2026-09-20",
        time: "20:00",
        partySize: 2,
      }),
      expect.any(Object),
    );
  });
});
