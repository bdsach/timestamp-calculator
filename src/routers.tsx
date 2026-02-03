import { lazy } from "react";

import { createBrowserRouter, Navigate } from "react-router";

const Layout = lazy(() => import("./layout"));
const ExtendedPage = lazy(() => import("./pages/extended"));
const NewPage = lazy(() => import("./pages/new"));
const NotFoundPage = lazy(() => import("./pages/notfound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/new" replace />,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "extended",
        Component: ExtendedPage,
      },
      {
        path: "new",
        Component: NewPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

