import type { RouterLocation } from './router-location';
import type { Route } from './route';

export type RouterState = {
  location: RouterLocation;
  route: Route | undefined;
  params: Record<string, string>;
};
