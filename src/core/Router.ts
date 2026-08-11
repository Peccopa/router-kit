import type { Route } from '../types/route';

export class Router {
  private routes: Record<string, Route>;

  constructor(routes: Record<string, Route>) {
    this.routes = routes;
  }
}
