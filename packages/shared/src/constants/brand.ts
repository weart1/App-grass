import brand from '../../brand.json';

/**
 * The working app name lives in ONE place: `packages/shared/brand.json`.
 * It is plain JSON so `apps/mobile/app.config.ts` can read it too.
 * Rename the product by editing that file.
 */
export const APP_NAME: string = brand.name;
export const APP_SLUG: string = brand.slug;
export const APP_SCHEME: string = brand.scheme;
export const APP_BUNDLE_ID: string = brand.bundleId;
export const APP_TAGLINE: string = brand.tagline;
