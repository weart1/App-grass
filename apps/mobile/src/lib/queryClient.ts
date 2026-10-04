import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { ApiClientError } from './api';
import { bindQueryOnlineManager } from './network';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 24 * 60 * 60_000,
        retry: (failureCount, error) => {
          // Don't retry client errors (validation, auth, not found).
          if (error instanceof ApiClientError && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: { retry: 0 },
    },
  });
}

/** Wire React Native app lifecycle + connectivity into TanStack Query. */
export function bindQueryLifecycle(): () => void {
  bindQueryOnlineManager();
  const onChange = (status: AppStateStatus) => {
    if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
  };
  const sub = AppState.addEventListener('change', onChange);
  return () => sub.remove();
}
