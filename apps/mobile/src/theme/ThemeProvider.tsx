import { lightTheme, type Theme } from '@leafy/ui-tokens';
import { createContext, use, type ReactNode } from 'react';

const ThemeContext = createContext<Theme>(lightTheme);

/**
 * Provides design tokens to the tree. v1 ships the light theme only; dark mode
 * plugs in here later (pick a theme from `useColorScheme()`), with no changes
 * needed in components because they read tokens through `useTheme()`.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext value={lightTheme}>{children}</ThemeContext>;
}

export function useTheme(): Theme {
  return use(ThemeContext);
}
