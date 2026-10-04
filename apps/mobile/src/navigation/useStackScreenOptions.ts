import type { Stack } from 'expo-router';
import type { ComponentProps } from 'react';

import { useTheme } from '@/theme';

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

/** Native-stack header styling shared by every stack in the app. */
export function useStackScreenOptions(): Exclude<
  StackScreenOptions,
  (...args: never[]) => unknown
> {
  const theme = useTheme();
  return {
    headerTintColor: theme.colors.primaryStrong,
    headerTitleStyle: { fontFamily: theme.fontFamily.semibold, color: theme.colors.textPrimary },
    headerStyle: { backgroundColor: theme.colors.bg },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: theme.colors.bg },
  };
}
