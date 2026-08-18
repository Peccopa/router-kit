import { describe, expect, it } from 'vitest';
import { matchRoute } from './matchRoute';

describe('matchRoute', () => {
  it('matches a static route', () => {
    expect(matchRoute('/about', '/about')).toEqual({
      params: {},
    });
  });

  it('does not match different static routes', () => {
    expect(matchRoute('/about', '/users')).toBeUndefined();
  });

  it('matches a dynamic route', () => {
    expect(matchRoute('/users/:id', '/users/42')).toEqual({
      params: {
        id: '42',
      },
    });
  });

  it('matches multiple dynamic parameters', () => {
    expect(
      matchRoute('/users/:userId/posts/:postId', '/users/42/posts/7'),
    ).toEqual({
      params: {
        userId: '42',
        postId: '7',
      },
    });
  });

  it('does not match an incomplete dynamic route', () => {
    expect(matchRoute('/users/:id', '/users')).toBeUndefined();
  });

  it('does not match an extra path segment', () => {
    expect(matchRoute('/users/:id', '/users/42/posts')).toBeUndefined();
  });
});

it('matches a static route before a dynamic route', () => {
  const routes = ['/users/:id', '/users/settings'];

  const matches = routes
    .map((route) => ({
      route,
      match: matchRoute(route, '/users/settings'),
    }))
    .filter((item) => item.match);

  expect(matches[0].route).toBe('/users/settings');
});

it('matches a dynamic route when no static route matches', () => {
  const routes = ['/users/:id', '/users/settings'];

  const matches = routes
    .map((route) => ({
      route,
      match: matchRoute(route, '/users/42'),
    }))
    .filter((item) => item.match);

  expect(matches[0].route).toBe('/users/:id');
});
