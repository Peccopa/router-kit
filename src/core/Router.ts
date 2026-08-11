import type { Listener } from '../types/listener';
import type { Route } from '../types/route';
import type { RouterLocation } from '../types/router-location';
import type { RouterState } from '../types/router-state';

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

    this.notify(this.getState());
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

    this.notify(this.getState());
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

  private notify(state: RouterState): void {
    this.listeners.forEach((listener) => {
      listener(state);
    });
  }

  private handlePopState = (): void => {
    this.notify(this.getState());
  };

  private handleClick = (event: MouseEvent): void => {
    if (!(event.target instanceof HTMLAnchorElement)) return;

    event.preventDefault();

    this.navigate(event.target.pathname);
  };

  private getLocation(): RouterLocation {
    const url = new URL(window.location.href);

    return {
      href: url.href,
      origin: url.origin,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    };
  }

  private getState(): RouterState {
    return {
      location: this.getLocation(),
      route: this.getRoute(window.location.pathname),
    };
  }
}
