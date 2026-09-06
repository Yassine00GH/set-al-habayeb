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

describe("ReservationPage reset flow", () => {
  it("returns to the form after a successful submission", async () => {
    const user = userEvent.setup();
    mutateMock.mockImplementation((_input, { onSuccess }) => {
      onSuccess();
    });

    render(<ReservationPage />);

    await user.type(screen.getByLabelText(/Nom complet/i), "Amira B.");
    await user.type(screen.getByLabelText(/Date/i), "2026-09-20");

    const selects = screen.getAllByTestId("mock-select");
    await user.selectOptions(selects[0], "20:00");
    await user.selectOptions(selects[1], "2");

    await user.click(
      screen.getByRole("button", { name: /Confirmer la réservation/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Demande envoyée !")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /Faire une autre réservation/i }),
    );

    expect(screen.queryByText("Demande envoyée !")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirmer la réservation/i }),
    ).toBeInTheDocument();
  });
});
