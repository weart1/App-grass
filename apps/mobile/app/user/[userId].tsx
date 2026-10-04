import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  return <PlaceholderScreen route="userProfile" params={{ userId }} illustration="community" />;
}
