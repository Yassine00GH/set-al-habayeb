import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useActor } from "@caffeineai/core-infrastructure";
import { ExternalBlob } from "@caffeineai/object-storage";

import { createActor } from "@/backend";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  category: string;
  span: string;
}

const GALLERY: GalleryImage[] = [
  {
    src: "/assets/generated/gallery-salle.dim_1200x900.jpg",
    alt: "La salle du restaurant aux murs en terre cuite, arches et lanternes en laiton",
    caption: "Notre salle baignée de lumière chaude",
    category: "La salle",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/assets/generated/gallery-couscous.dim_1200x900.jpg",
    alt: "Couscous tunisien à l'agneau servi dans un plat en terre cuite",
    caption: "Couscous royal à l'agneau",
    category: "Les plats",
    span: "",
  },
  {
    src: "/assets/generated/gallery-brik.dim_1200x900.jpg",
    alt: "Bricks tunisiennes croustillantes dorées avec citron et harissa",
    caption: "Bricks dorées au citron",
    category: "Les plats",
    span: "",
  },
  {
    src: "/assets/generated/gallery-the.dim_1200x900.jpg",
    alt: "Thé à la menthe versé d'une théière en laiton dans des verres ornés",
    caption: "Thé à la menthe à la tunisienne",
    category: "Les boissons",
    span: "",
  },
  {
    src: "/assets/generated/gallery-brochettes.dim_1200x900.jpg",
    alt: "Brochettes d'agneau grillées à la harissa sur un plat en céramique",
    caption: "Brochettes grillées à la harissa",
    category: "Les plats",
    span: "",
  },
  {
    src: "/assets/generated/gallery-makroudh.dim_1200x900.jpg",
    alt: "Makrouds au miel et au sésame disposés sur une assiette en céramique",
    caption: "Makrouds au miel et sésame",
    category: "Les desserts",
    span: "",
  },
  {
    src: "/assets/generated/gallery-chef.dim_1200x900.jpg",
    alt: "Les mains d'un chef dressant un plat dans la cuisine du restaurant",
    caption: "Le geste du chef",
    category: "L'atelier",
    span: "md:col-span-2",
  },
];

const CATEGORIES = [
  "Tout",
  "La salle",
  "Les plats",
  "Les desserts",
  "L'atelier",
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Tout"
      ? GALLERY
      : GALLERY.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const stepLightbox = useCallback(
    (direction: 1 | -1) => {
      setLightboxIndex((current) => {
        if (current === null) return current;
        return (current + direction + filtered.length) % filtered.length;
      });
    },
    [filtered.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") stepLightbox(1);
      if (event.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, stepLightbox]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Galerie"
        title="Nos photos"
        description="Plongez dans l'ambiance de notre restaurant et découvrez nos plats en images."
      />

      <div
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Filtrer la galerie"
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            data-ocid={`gallery.filter.${category.toLowerCase().replace(/\s+/g, "_")}`}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              activeCategory === category
                ? "border-accent bg-accent text-accent-foreground shadow-subtle"
                : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[220px]">
        {filtered.map((image, index) => (
          <motion.button
            key={image.src}
            type="button"
            data-ocid={`gallery.item.${index + 1}`}
            onClick={() => openLightbox(index)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
            className={cn(
              "group relative overflow-hidden rounded-[1.25rem] border border-border bg-card text-left shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              image.span,
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {image.category}
                </span>
                <p className="mt-1 font-display text-lg font-medium text-white">
                  {image.caption}
                </p>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                <ChevronRight className="size-4" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <UploadSection />

      {lightboxIndex !== null && filtered[lightboxIndex] ? (
        <Lightbox
          image={filtered[lightboxIndex]}
          index={lightboxIndex}
          total={filtered.length}
          onClose={closeLightbox}
          onPrev={() => stepLightbox(-1)}
          onNext={() => stepLightbox(1)}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  image,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <dialog
      open
      aria-label={`Visionneuse d'images — ${image.caption}`}
      data-ocid="gallery.lightbox"
      className="fixed inset-0 z-50 m-0 flex h-full w-full flex-col bg-black/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
        <span className="text-sm text-white/70">
          {index + 1} / {total}
        </span>
        <button
          ref={closeRef}
          type="button"
          data-ocid="gallery.lightbox.close_button"
          onClick={onClose}
          aria-label="Fermer la visionneuse"
          className="grid size-11 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="size-6" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
        <button
          type="button"
          data-ocid="gallery.lightbox.prev_button"
          onClick={onPrev}
          aria-label="Image précédente"
          className="absolute left-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:left-6"
        >
          <ChevronLeft className="size-6" />
        </button>

        <motion.figure
          key={image.src}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex max-h-full max-w-5xl flex-col items-center"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="max-h-[70vh] w-auto rounded-xl object-contain shadow-2xl"
          />
          <figcaption className="mt-5 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              {image.category}
            </span>
            <p className="mt-1 font-display text-xl text-white">
              {image.caption}
            </p>
          </figcaption>
        </motion.figure>

        <button
          type="button"
          data-ocid="gallery.lightbox.next_button"
          onClick={onNext}
          aria-label="Image suivante"
          className="absolute right-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-6"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>
    </dialog>
  );
}

function UploadSection() {
  const { actor } = useActor(createActor);
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Veuillez choisir une image (JPG, PNG, WebP…).");
      return;
    }
    setError(null);
    setSuccess(null);
    setUploading(true);
    setProgress(0);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(
        bytes,
        file.type,
        file.name,
      ).withUploadProgress((pct) => setProgress(pct));

      // The upload method is provided by the object-storage backend mixin.
      const upload = (
        actor as unknown as {
          uploadGalleryImage?: (
            name: string,
            blob: ExternalBlob,
          ) => Promise<unknown>;
        }
      ).uploadGalleryImage;

      if (!actor || typeof upload !== "function") {
        throw new Error(
          "Le service de téléversement n'est pas encore disponible. Réessayez dans un instant.",
        );
      }

      await upload(file.name, blob);
      setProgress(100);
      setSuccess("Votre photo a bien été ajoutée à la galerie.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors du téléversement de la photo.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section
      data-ocid="gallery.upload_section"
      className="mt-16 overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-subtle"
    >
      <div className="grid gap-0 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
            <ImagePlus className="size-3.5" />
            Partager vos souvenirs
          </span>
          <h3 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Ajoutez vos photos
          </h3>
          <p className="text-muted-foreground">
            Vous avez immortalisé un plat ou l'ambiance du restaurant ? Partagez
            votre photo avec notre communauté.
          </p>
          <Button
            type="button"
            data-ocid="gallery.upload_button"
            size="lg"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="w-fit"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            {uploading ? "Téléversement…" : "Choisir une photo"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            data-ocid="gallery.upload_input"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
        </div>

        <div className="flex flex-col justify-center gap-4 border-t border-border bg-muted/40 p-8 sm:p-10 md:border-l md:border-t-0">
          {uploading ? (
            <div
              className="flex flex-col gap-3"
              data-ocid="gallery.upload_progress"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  Téléversement en cours…
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progress ?? 0)}%
                </span>
              </div>
              <Progress value={progress ?? 0} />
            </div>
          ) : null}

          {error ? (
            <p
              data-ocid="gallery.upload_error"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          {success ? (
            <p
              data-ocid="gallery.upload_success"
              className="rounded-xl border border-secondary/40 bg-secondary/15 px-4 py-3 text-sm text-secondary-foreground"
            >
              {success}
            </p>
          ) : null}

          {!uploading && !error && !success ? (
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Bon à savoir</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Formats acceptés : JPG, PNG, WebP.</li>
                <li>Votre photo sera visible dans la galerie.</li>
                <li>Merci de ne partager que des photos du restaurant.</li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
