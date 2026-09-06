import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import DishDetailPage from "@/pages/DishDetailPage";
import GalleryPage from "@/pages/GalleryPage";
import HomePage from "@/pages/Home";
import MenuPage from "@/pages/MenuPage";
import ReservationPage from "@/pages/ReservationPage";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});

const dishDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu/$dishId",
  component: DishDetailPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/galerie",
  component: GalleryPage,
});

const reservationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reservation",
  component: ReservationPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  dishDetailRoute,
  galleryRoute,
  reservationRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
