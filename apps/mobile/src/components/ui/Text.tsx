import type { ColorToken, TypographyVariant } from '@leafy/ui-tokens';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/theme';

const HEADING_VARIANTS: ReadonlySet<TypographyVariant> = new Set(['display', 'h1', 'h2', 'h3']);

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorToken;
  align?: 'auto' | 'left' | 'center' | 'right';
  italic?: boolean;
}

/**
 * The only text primitive screens should use. Applies a typography token,
 * a color token, and caps Dynamic Type scaling at `maxFontScale` (1.3×).
 */
export function Text({
  variant = 'body',
  color = 'textPrimary',
  align,
  italic,
  style,
  accessibilityRole,
  ...rest
}: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={theme.maxFontScale}
      accessibilityRole={
        accessibilityRole ?? (HEADING_VARIANTS.has(variant) ? 'header' : undefined)
      }
      style={[
        theme.typography[variant],
        { color: theme.colors[color] },
        align ? { textAlign: align } : null,
        italic ? { fontStyle: 'italic' } : null,
        style,
      ]}
      {...rest}
    />
  );
}
