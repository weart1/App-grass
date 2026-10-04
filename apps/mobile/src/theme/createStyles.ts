import type { Theme } from '@leafy/ui-tokens';
import { StyleSheet } from 'react-native';

import { useTheme } from './ThemeProvider';

type NamedStyles<T> = StyleSheet.NamedStyles<T>;

/**
 * Theme-aware `StyleSheet.create`. Styles are computed once per theme object
 * and cached, so components pay no per-render cost.
 *
 * @example
 * const useStyles = createStyles((t) => ({ card: { padding: t.spacing[4] } }));
 * function Card() { const s = useStyles(); return <View style={s.card} />; }
 */
export function createStyles<T extends NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache = new WeakMap<Theme, T>();
  return function useStyles(): T {
    const theme = useTheme();
    let styles = cache.get(theme);
    if (!styles) {
      styles = StyleSheet.create(factory(theme));
      cache.set(theme, styles);
    }
    return styles;
  };
}
