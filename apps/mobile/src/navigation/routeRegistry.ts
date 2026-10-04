import type { Href } from 'expo-router';

/**
 * Every screen from SPEC §4.2 that is still a placeholder, with the phase that
 * builds it. Used by PlaceholderScreen (badge) and the dev route index.
 * Remove an entry when its real screen lands.
 */
export const PLACEHOLDER_ROUTES = {
  onboarding: { href: '/welcome', phase: 2 },
  permissions: { href: '/permissions', phase: 2 },
  signIn: { href: '/sign-in', phase: 2 },
  verifyCode: { href: '/verify-code', phase: 2 },
  profileSetup: { href: '/profile-setup', phase: 2 },
  scanProcessing: { href: '/scan/processing', phase: 3 },
  scanResult: { href: '/scan/result/demo-scan', phase: 3 },
  scanHistory: { href: '/scan/history', phase: 3 },
  plantNew: { href: '/plant/new', phase: 4 },
  plantDetail: { href: '/plant/demo-plant', phase: 4 },
  plantEdit: { href: '/plant/demo-plant/edit', phase: 4 },
  journalNew: { href: '/plant/demo-plant/journal-new', phase: 4 },
  plantSchedule: { href: '/plant/demo-plant/schedule', phase: 4 },
  postNew: { href: '/post/new', phase: 6 },
  postDetail: { href: '/post/demo-post', phase: 6 },
  notifications: { href: '/notifications', phase: 6 },
  search: { href: '/search', phase: 6 },
  userProfile: { href: '/user/demo-user', phase: 7 },
  settings: { href: '/settings', phase: 7 },
  settingsAccount: { href: '/settings/account', phase: 7 },
  settingsNotifications: { href: '/settings/notifications', phase: 7 },
  settingsPrivacy: { href: '/settings/privacy', phase: 7 },
  settingsUnits: { href: '/settings/units', phase: 7 },
  settingsAbout: { href: '/settings/about', phase: 7 },
} as const satisfies Record<string, { href: Href; phase: number }>;

export type PlaceholderRouteKey = keyof typeof PLACEHOLDER_ROUTES;
