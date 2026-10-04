import { Stack } from 'expo-router';

import { useStackScreenOptions } from '@/navigation/useStackScreenOptions';

/** Scanner flow, presented as a full-screen modal from the tab bar. */
export default function ScanLayout() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="processing" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
