import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components';

export default function ScanResultScreen() {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  return <PlaceholderScreen route="scanResult" params={{ scanId }} illustration="sprout" />;
}
