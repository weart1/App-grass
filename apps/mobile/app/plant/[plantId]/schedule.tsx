import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components';

export default function CareScheduleScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  return <PlaceholderScreen route="plantSchedule" params={{ plantId }} />;
}
