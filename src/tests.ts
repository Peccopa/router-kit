import { Router } from './core/Router';
import type { RouterState } from './types/router-state';

// const router = new Router({
//   '/': { name: 'home' },
//   '/about': { name: 'about' },
//   '/users': { name: 'users' },
//   '/users/:id': { name: 'user' },
//   '/users/:userId/posts/:postId': {
//     name: 'user-post',
//   },
// });

const router = new Router({
  '/users/:id': {
    name: 'user',
  },

  '/users/settings': {
    name: 'settings',
  },
});

function render(state: RouterState): void {
  const main = document.querySelector('#main');

  if (!main) return;

  main.replaceChildren();

  const title = document.createElement('h1');

  if (!state.route) {
    title.textContent = '404 - Page not found';
  } else {
    title.textContent = state.route.name;
  }

  main.appendChild(title);
}

// router.subscribe((state) => {
//   render(state);
// });

router.subscribe((state) => {
  console.log(state);
  render(state);
});

// router.navigate('/users/42');

router.start();


router.navigate('/users/settings');
// router.navigate('/users/42/posts/7');

