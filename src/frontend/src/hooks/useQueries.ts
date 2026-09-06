import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createActor } from "@/backend";
import type { Dish, Reservation } from "@/types";

export function useDishes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      if (!actor) return [] as Dish[];
      return actor.getDishes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDish(id: bigint | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["dish", id],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getDish(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export interface CreateReservationInput {
  name: string;
  date: string;
  time: string;
  partySize: number;
  message: string;
}

export function useCreateReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReservationInput): Promise<Reservation> => {
      if (!actor) throw new Error("Le service n'est pas encore prêt");
      return actor.createReservation(
        input.name,
        input.date,
        input.time,
        BigInt(input.partySize),
        input.message,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useReservations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      if (!actor) return [] as Reservation[];
      return actor.getReservations();
    },
    enabled: !!actor && !isFetching,
  });
}
