// Per-weight imports: the package root would bundle all 18 Inter files (~6 MB).
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { OfflineBannerHost, ToastHost } from '@/components';
import { BrandSplash } from '@/components/layout/BrandSplash';
import { AgentationHost } from '@/dev/AgentationHost';
import '@/i18n';
import { useStackScreenOptions } from '@/navigation/useStackScreenOptions';
import { AppProviders } from '@/providers/AppProviders';

void SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <RootStack />
      <OfflineBannerHost />
      <ToastHost />
      <BrandSplash />
      <AgentationHost />
    </AppProviders>
  );
}

function RootStack() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="scan"
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="plant/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="post/new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="dev" options={{ headerShown: false }} />
    </Stack>
  );
}
