import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components';

export default function PlantDetailScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  return <PlaceholderScreen route="plantDetail" params={{ plantId }} />;
}
