import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components';

export default function NewJournalEntryScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  return <PlaceholderScreen route="journalNew" params={{ plantId }} />;
}
