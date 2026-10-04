import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components';

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  return <PlaceholderScreen route="postDetail" params={{ postId }} illustration="community" />;
}
