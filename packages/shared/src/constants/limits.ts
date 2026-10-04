/** Product limits shared by the client (UX) and the API (enforcement). */
export const LIMITS = {
  /** Photos of the same plant per scan (leaf, flower, whole plant). */
  maxScanPhotos: 3,
  /** Photos per community post. */
  maxPostMedia: 10,
  /** Upload size cap enforced when issuing Blob upload tokens. */
  maxUploadBytes: 10 * 1024 * 1024,
  /** Client-side resize before upload. */
  imageMaxDimension: 1600,
  imageJpegQuality: 0.8,
  /** Free tier rate limits. */
  freeScansPerDay: 10,
  apiWritesPerMinute: 60,
  /** Scan request timeout shown to the user. */
  scanTimeoutMs: 30_000,
  /** Below this confidence the report shows "Not sure" + alternatives. */
  lowConfidenceThreshold: 0.6,
  captionMaxLength: 2200,
  commentMaxLength: 1000,
  bioMaxLength: 160,
  usernameMinLength: 3,
  usernameMaxLength: 24,
} as const;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
