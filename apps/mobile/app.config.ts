import type { ConfigContext, ExpoConfig } from 'expo/config';

// Single source of truth for the product name — see packages/shared/brand.json.
import brand from '@leafy/shared/brand.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: brand.name,
  slug: brand.slug,
  scheme: brand.scheme,
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/images/icon.png',
  ios: {
    bundleIdentifier: brand.bundleId,
    supportsTablet: false,
  },
  android: {
    package: brand.bundleId,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    // Web is a developer preview target only (see DECISIONS.md D-011).
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-localization',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 120,
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
      },
    ],
    [
      '@react-native-community/datetimepicker',
      {
        android: {
          datePicker: {
            colorAccent: { light: '#2A7F33' },
          },
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
