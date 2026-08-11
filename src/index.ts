import { Router } from './core/Router';

const router = new Router({
  '/': { name: 'home' },
  '/about': { name: 'about' },
  '/users': { name: 'users' },
});

function render(): void {
  const currentRoute = router.getRoute(window.location.pathname);

  const main = document.querySelector('#main');

  if (main) {
    main.replaceChildren();

    const title = document.createElement('h1');
    title.textContent = currentRoute.name;
    main.appendChild(title);
  }
}

router.subscribe(() => {
  render();
});

router.start();
