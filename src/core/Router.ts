import type { Listener } from '../types/listener';
import type { Route } from '../types/route';

export class Router {
  private routes: Record<string, Route>;
  private listeners: Listener[] = [];

  constructor(routes: Record<string, Route>) {
    this.routes = routes;

    window.addEventListener('popstate', () => {
      const route = this.getRoute(window.location.pathname);

      this.notify(route);
    });

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLAnchorElement)) return;

      event.preventDefault();

      this.navigate(event.target.pathname);
    });
  }

  getRoute(path: string): Route {
    return this.routes[path] || this.routes['/'];
  }

  navigate(path: string): void {
    history.pushState({}, '', path);

    const route = this.getRoute(window.location.pathname);

    this.notify(route);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);

      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(route: Route): void {
    this.listeners.forEach((listener) => {
      listener(route);
    });
  }
}
