const routes: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/users': 'Users',
};

function getRoute(path: string): string {
  return routes[path] || 'Home';
}

document.addEventListener('click', (event) => {
  event.preventDefault();

  if (!(event.target instanceof HTMLAnchorElement)) return;

  const url = new URL(event.target.href);

  history.pushState({}, '', url.pathname);

  console.log(getRoute(window.location.pathname));
});

const path = window.location.pathname;

console.log(getRoute(path));
