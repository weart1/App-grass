import type { ImageSource } from 'expo-image';

/** A remote URL (API data) or a bundled asset (`require('./x.jpg')`). */
export type ImageLike = string | number;

export function toImageSource(src: ImageLike): ImageSource | number {
  return typeof src === 'string' ? { uri: src } : src;
}
