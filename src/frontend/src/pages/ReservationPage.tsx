import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateReservationInput,
  useCreateReservation,
} from "@/hooks/useQueries";

const RESTAURANT = {
  name: "Set Al Habayeb",
  address: "16 Rue Boukhrissan, Tunis 1000",
  phone: "22 060 729",
  phoneHref: "tel:+21622060729",
  directionsHref:
    "https://www.google.com/maps/dir/?api=1&destination=16+Rue+Boukhrissan+Tunis",
};

const PARTY_SIZES = ["1", "2", "3", "4", "5", "6", "7", "8"];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

interface FormState {
  name: string;
  date: string;
  time: string;
  partySize: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  date: "",
  time: "",
  partySize: "",
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function ReservationPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const createReservation = useCreateReservation();

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (values: FormState): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) {
      next.name = "Veuillez indiquer votre nom.";
    }
    if (!values.date) {
      next.date = "Veuillez choisir une date.";
    }
    if (!values.time) {
      next.time = "Veuillez choisir une heure.";
    }
    if (!values.partySize) {
      next.partySize = "Veuillez indiquer le nombre de personnes.";
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input: CreateReservationInput = {
      name: form.name.trim(),
      date: form.date,
      time: form.time,
      partySize: Number(form.partySize),
      message: form.message.trim(),
    };

    createReservation.mutate(input, {
      onSuccess: () => {
        setForm(INITIAL_FORM);
        setSubmitted(true);
      },
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Réservation"
        title="Réserver une table"
        description="Réservez votre table en quelques instants. Nous vous attendons avec plaisir."
      />

      {/* Hours banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl border border-accent/25 bg-accent/10 px-6 py-5 text-center sm:flex-row sm:gap-6 sm:text-left"
        data-ocid="hours_banner"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ouvert dès 09:00
            </p>
            <p className="text-sm text-muted-foreground">
              Tous les jours, sauf le dimanche
            </p>
          </div>
        </div>
        <span
          className="hidden h-10 w-px bg-accent/25 sm:block"
          aria-hidden="true"
        />
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
          Fermé le dimanche
        </span>
      </motion.div>

      <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-12">
        {/* Reservation form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-3"
        >
          <Card className="rounded-3xl border-border bg-card p-6 shadow-subtle sm:p-10">
            {submitted ? (
              <div
                className="flex flex-col items-center gap-5 py-10 text-center"
                data-ocid="reservation_success_state"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-secondary/30 text-secondary-foreground">
                  <CheckCircle2 className="size-9" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    Demande envoyée !
                  </h3>
                  <p className="max-w-md text-muted-foreground">
                    Merci {form.name || "pour votre demande"} ! Nous avons bien
                    reçu votre réservation et nous vous confirmerons par
                    téléphone. À très bientôt chez Set Al Habayeb.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setSubmitted(false)}
                  data-ocid="reservation_new_button"
                >
                  Faire une autre réservation
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6"
                data-ocid="reservation_form"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reservation-name">Nom complet</Label>
                  <Input
                    id="reservation-name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Votre nom"
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "reservation-name-error" : undefined
                    }
                    data-ocid="reservation_name_input"
                  />
                  {errors.name ? (
                    <p
                      id="reservation-name-error"
                      className="text-sm text-destructive"
                      data-ocid="reservation_name_error"
                    >
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reservation-date">Date</Label>
                    <div className="relative">
                      <CalendarDays
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="reservation-date"
                        name="date"
                        type="date"
                        min={today}
                        value={form.date}
                        onChange={(e) => setField("date", e.target.value)}
                        aria-invalid={!!errors.date}
                        aria-describedby={
                          errors.date ? "reservation-date-error" : undefined
                        }
                        className="pl-9"
                        data-ocid="reservation_date_input"
                      />
                    </div>
                    {errors.date ? (
                      <p
                        id="reservation-date-error"
                        className="text-sm text-destructive"
                        data-ocid="reservation_date_error"
                      >
                        {errors.date}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reservation-time">Heure</Label>
                    <Select
                      value={form.time}
                      onValueChange={(value) => setField("time", value)}
                    >
                      <SelectTrigger
                        id="reservation-time"
                        className="w-full"
                        aria-invalid={!!errors.time}
                        data-ocid="reservation_time_select"
                      >
                        <SelectValue placeholder="Choisir une heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time ? (
                      <p
                        className="text-sm text-destructive"
                        data-ocid="reservation_time_error"
                      >
                        {errors.time}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reservation-party">Nombre de personnes</Label>
                  <div className="relative">
                    <Users
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Select
                      value={form.partySize}
                      onValueChange={(value) => setField("partySize", value)}
                    >
                      <SelectTrigger
                        id="reservation-party"
                        className="w-full pl-9"
                        aria-invalid={!!errors.partySize}
                        data-ocid="reservation_party_select"
                      >
                        <SelectValue placeholder="Combien serez-vous ?" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTY_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} {size === "1" ? "personne" : "personnes"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.partySize ? (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="reservation_party_error"
                    >
                      {errors.partySize}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reservation-message">
                    Message (facultatif)
                  </Label>
                  <Textarea
                    id="reservation-message"
                    name="message"
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    placeholder="Occasion spéciale, allergies, préférences…"
                    rows={4}
                    data-ocid="reservation_message_input"
                  />
                </div>

                {createReservation.isError ? (
                  <p
                    className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    data-ocid="reservation_error_state"
                  >
                    Une erreur est survenue lors de l&apos;envoi de votre
                    demande. Veuillez réessayer.
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={createReservation.isPending}
                  data-ocid="reservation_submit_button"
                >
                  {createReservation.isPending
                    ? "Envoi en cours…"
                    : "Confirmer la réservation"}
                </Button>
              </form>
            )}
          </Card>
        </motion.div>

        {/* Contact section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col gap-6 lg:col-span-2"
        >
          <Card className="rounded-3xl border-border bg-card p-6 shadow-subtle sm:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Adresse
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {RESTAURANT.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Téléphone
                  </h3>
                  <a
                    href={RESTAURANT.phoneHref}
                    className="mt-1 inline-block text-sm text-muted-foreground transition-smooth hover:text-foreground"
                    data-ocid="contact_phone_link"
                  >
                    {RESTAURANT.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button
                  asChild
                  className="flex-1 rounded-full"
                  data-ocid="contact_call_button"
                >
                  <a href={RESTAURANT.phoneHref}>
                    <Phone className="size-4" aria-hidden="true" />
                    Appeler
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 rounded-full"
                  data-ocid="contact_directions_button"
                >
                  <a
                    href={RESTAURANT.directionsHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="size-4" aria-hidden="true" />
                    Itinéraire
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Static map */}
          <Card className="overflow-hidden rounded-3xl border-border bg-card p-0 shadow-subtle">
            <div
              className="relative h-64 w-full bg-gradient-subtle sm:h-72"
              data-ocid="contact_map"
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage:
                    "url('https://tile.openstreetmap.org/12/2015/1399.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="relative flex size-12 items-center justify-center">
                  <span
                    className="absolute inline-flex size-full animate-ping rounded-full bg-accent/40"
                    aria-hidden="true"
                  />
                  <span className="relative flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-background/80 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  <span>{RESTAURANT.address}</span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  data-ocid="contact_map_directions_button"
                >
                  <a
                    href={RESTAURANT.directionsHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="size-4" aria-hidden="true" />Y aller
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
