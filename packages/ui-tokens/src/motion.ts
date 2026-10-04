export const motion = {
  duration: {
    fast: 150,
    base: 250,
    slow: 400,
    /** Scan button idle pulse loop. */
    pulse: 2000,
    /** Camera viewfinder scan-line sweep. */
    scanLine: 2400,
    toast: 2800,
  },
  /** Scale applied to pressable surfaces on press-in. */
  pressScale: {
    scanButton: 0.92,
    default: 0.97,
  },
  spring: {
    damping: 18,
    stiffness: 220,
    mass: 1,
  },
} as const;
