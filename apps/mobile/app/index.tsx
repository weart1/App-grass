import { Redirect } from 'expo-router';

/**
 * Entry point. Phase 2 routes here based on onboarding/auth state
 * (welcome → sign-in → profile setup → tabs).
 */
export default function Index() {
  return <Redirect href="/garden" />;
}
