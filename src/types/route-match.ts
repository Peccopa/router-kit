import type { Route } from './route';

export type RouteMatch = {
  route: Route;
  params: Record<string, string>;
};
