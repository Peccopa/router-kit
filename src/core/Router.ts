import type { Listener } from '../types/listener';
import type { Route } from '../types/route';

export class Router {
  private routes: Record<string, Route>;
  private listeners: Listener[] = [];
  private started = false;

  constructor(routes: Record<string, Route>) {
    this.routes = routes;
  }

  start(): void {
    if (this.started) return;

    this.started = true;

    window.addEventListener('popstate', this.handlePopState);
    document.addEventListener('click', this.handleClick);
  }

  stop(): void {
    if (!this.started) return;

    window.removeEventListener('popstate', this.handlePopState);
    document.removeEventListener('click', this.handleClick);

    this.started = false;
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

  private handlePopState = (): void => {
    const route = this.getRoute(window.location.pathname);

    this.notify(route);
  };

  private handleClick = (event: MouseEvent): void => {
    if (!(event.target instanceof HTMLAnchorElement)) return;

    event.preventDefault();

    this.navigate(event.target.pathname);
  };
}
