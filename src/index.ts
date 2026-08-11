import { Router } from './core/Router';
import type { RouterState } from './types/router-state';

const router = new Router({
  '/': { name: 'home' },
  '/about': { name: 'about' },
  '/users': { name: 'users' },
});

function render(state: RouterState): void {
  console.log(state);

  const main = document.querySelector('#main');

  if (!main) return;

  main.replaceChildren();

  const title = document.createElement('h1');
  title.textContent = state.route.name;

  main.appendChild(title);
}

router.subscribe((state) => {
  render(state);
});

router.start();

router.navigate('https://google.com');