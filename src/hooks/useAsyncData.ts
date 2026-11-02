import { useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'ready'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null, error: null });
    loader()
      .then((data) => {
        if (active) setState({ status: 'ready', data, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          setState({
            status: 'error',
            data: null,
            error: err instanceof Error ? err.message : 'Something went wrong.',
          });
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
