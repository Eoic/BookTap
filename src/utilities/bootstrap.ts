import { Router } from "express";
import { Route, Wrapper } from "./types";

export const useMiddleware = (middlewareWrappers: Wrapper[], router: Router) => {
  middlewareWrappers.forEach((wrapper) => {
    wrapper(router);
  });
};

export const useRoutes = (routes: Route[], router: Router) => {
  routes.forEach((route) => {
    const { method, path, handler, validator } = route;
    (router as any)[method](path, validator || [], handler);
  });
};
