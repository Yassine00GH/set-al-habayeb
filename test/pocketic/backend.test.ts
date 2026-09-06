import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("seeds the menu with the six popular dishes on install", async () => {
  const dishes = await actor.getDishes();
  expect(dishes.length).toBeGreaterThanOrEqual(6);
  const names = dishes.map((d) => d.name);
  expect(names).toContain("Couscous au poulet et légumes");
  expect(names).toContain("Merguez");
  expect(names).toContain("Madfouna");
  expect(names).toContain("Spaghetti");
  expect(names).toContain("Saganáki");
  expect(names).toContain("Café turc");
});

it("returns a single dish by id without trapping", async () => {
  const dishes = await actor.getDishes();
  const first = dishes[0];
  const found = await actor.getDish(first.id);
  expect(found).toEqual([first]);
});

it("returns an empty optional for an unknown dish id", async () => {
  const missing = await actor.getDish(999999n);
  expect(missing).toEqual([]);
});

it("round-trips a reservation through the real canister", async () => {
  const created = await actor.createReservation(
    "Amira B.",
    "2026-09-20",
    "20:00",
    2n,
    "Table près de la fenêtre",
  );
  expect(created.name).toBe("Amira B.");
  expect(created.partySize).toBe(2n);

  const reservations = await actor.getReservations();
  expect(reservations).toContainEqual(
    expect.objectContaining({ id: created.id, name: "Amira B.", date: "2026-09-20", time: "20:00" }),
  );
});

it("answers an empty gallery read instead of trapping", async () => {
  const images = await actor.getGalleryImages();
  expect(images).toEqual([]);
});
