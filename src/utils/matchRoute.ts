export type RouteMatch = {
  params: Record<string, string>;
};

export function matchRoute(
  pattern: string,
  pathname: string,
): RouteMatch | undefined {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');

  if (patternParts.length !== pathParts.length) {
    return undefined;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i += 1) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
      continue;
    }

    if (patternPart !== pathPart) {
      return undefined;
    }
  }

  return { params };
}
