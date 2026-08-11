const routes: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/users': 'Users',
};

function getRoute(path: string): string {
  return routes[path] || 'Home';
}

function navigate(path: string): void {
  history.pushState({}, '', path);

  console.log(getRoute(window.location.pathname));
}

document.addEventListener('click', (event) => {
  event.preventDefault();

  if (!(event.target instanceof HTMLAnchorElement)) return;

  const path = event.target.pathname;
  navigate(path);
});
