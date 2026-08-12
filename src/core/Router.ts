import { matchRoute } from '../utils/matchRoute';

import type { Listener } from '../types/listener';
import type { Route } from '../types/route';
import type { RouteMatch } from '../types/route-match';
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

  getRoute(path: string): RouteMatch | undefined {
    for (const [pattern, route] of Object.entries(this.routes)) {
      const match = matchRoute(pattern, path);

      if (match) {
        return {
          route,
          params: match.params,
        };
      }
    }

    return undefined;
  }

  navigate(to: string): void {
    const url = new URL(to, window.location.origin);

    if (url.origin !== window.location.origin) return;

    history.pushState({}, '', url.href);

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
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('a');

    if (!link) return;

    const url = new URL(link.href);

    if (url.origin !== window.location.origin) return;

    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === '_blank'
    ) {
      return;
    }

    event.preventDefault();

    this.navigate(link.href);
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
    const match = this.getRoute(window.location.pathname);

    return {
      location: this.getLocation(),
      route: match?.route,
      params: match?.params ?? {},
    };
  }
}
