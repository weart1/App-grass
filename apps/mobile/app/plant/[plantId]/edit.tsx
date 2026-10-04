import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components';

export default function EditPlantScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  return <PlaceholderScreen route="plantEdit" params={{ plantId }} />;
}
