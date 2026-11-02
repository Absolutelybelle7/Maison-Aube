import { useEffect, useState } from 'react';

export const ROUTES = {
  '/': 'Home',
  '/services': 'Services',
  '/team': 'Team',
  '/gallery': 'Gallery',
  '/book': 'Book',
  '/contact': 'Contact',
} as const;

export type RoutePath = keyof typeof ROUTES;

function readPath(): RoutePath {
  const path = window.location.hash.replace(/^#/, '') || '/';
  return path in ROUTES ? (path as RoutePath) : '/';
}

export function useRoute(): RoutePath {
  const [path, setPath] = useState<RoutePath>(readPath);

  useEffect(() => {
    const handleChange = () => setPath(readPath());
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return path;
}
