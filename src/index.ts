import type { Route } from './types/route';
type Listener = (route: Route) => void;

function subscribe(listener: Listener): () => void {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}

function notify(route: Route): void {
  listeners.forEach((listener) => {
    listener(route);
  });
}

const listeners: Listener[] = [];

const routes: Record<string, Route> = {
  '/': { name: 'home' },
  '/about': { name: 'about' },
  '/users': { name: 'users' },
};

function getRoute(path: string): Route {
  return routes[path] || routes['/'];
}

function render(): void {
  const currentRoute = getRoute(window.location.pathname);

  const main = document.querySelector('#main');

  if (main) {
    main.replaceChildren();

    const title = document.createElement('h1');
    title.textContent = currentRoute.name;
    main.appendChild(title);
  }
}

document.addEventListener('click', (event) => {
  event.preventDefault();

  if (!(event.target instanceof HTMLAnchorElement)) return;

  const path = event.target.pathname;
  navigate(path);
});

function navigate(path: string): void {
  history.pushState({}, '', path);

  const route = getRoute(window.location.pathname);

  notify(route);
  render();
}

window.addEventListener('popstate', () => {
  const route = getRoute(window.location.pathname);

  notify(route);
  render();
});

subscribe((route) => {
  console.log('Route changed:', route);
});

render();
