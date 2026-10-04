import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme';

export type IllustrationName =
  'pot' | 'sprout' | 'calendar' | 'community' | 'search' | 'error' | 'offline' | 'scan';

export interface IllustrationProps {
  name: IllustrationName;
  width?: number;
}

/**
 * Soft, friendly spot illustrations drawn from palette tokens.
 * Decorative only — hidden from screen readers.
 */
export function Illustration({ name, width = 200 }: IllustrationProps) {
  const { colors: c, illustration: i } = useTheme();
  const height = width * 0.8;

  const pot = (
    <G>
      <Ellipse cx={100} cy={146} rx={58} ry={8} fill={c.surfaceAlt} />
      <Path d="M64 92h72l-9 48a6 6 0 0 1-6 5H79a6 6 0 0 1-6-5z" fill={i.clay} />
      <Rect x={57} y={80} width={86} height={17} rx={7} fill={i.clayDeep} />
      <Ellipse cx={100} cy={82} rx={36} ry={4.5} fill={i.soil} />
    </G>
  );

  const scenes: Record<IllustrationName, ReactNode> = {
    pot: (
      <G>
        <Circle cx={42} cy={52} r={5} fill={c.primary100} />
        <Circle cx={160} cy={40} r={4} fill={c.primary300} />
        <Circle cx={150} cy={74} r={6} fill={c.primary50} />
        <Path
          d="M100 79V54"
          stroke={c.primary300}
          strokeWidth={3}
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <Path
          d="M100 60c-13-1-20-10-18-22 12 1 19 9 18 22z"
          stroke={c.primary300}
          strokeWidth={3}
          strokeDasharray="4 5"
          fill="none"
        />
        {pot}
      </G>
    ),
    sprout: (
      <G>
        <Circle cx={156} cy={38} r={13} fill={c.sun} opacity={0.85} />
        <Path d="M100 80V46" stroke={c.primary} strokeWidth={4.5} strokeLinecap="round" />
        <Path d="M100 60c-14 0-22-10-20-23 14 0 22 9 20 23z" fill={c.primary} />
        <Path d="M100 52c12 0 21-9 20-21-13 0-21 9-20 21z" fill={c.primary300} />
        {pot}
      </G>
    ),
    calendar: (
      <G>
        <Ellipse cx={100} cy={146} rx={58} ry={8} fill={c.surfaceAlt} />
        <Rect
          x={50}
          y={36}
          width={100}
          height={98}
          rx={14}
          fill={c.bg}
          stroke={c.border}
          strokeWidth={3}
        />
        <Rect x={51.5} y={37.5} width={97} height={26} rx={12.5} fill={c.primary100} />
        <Rect x={51.5} y={52} width={97} height={12} fill={c.primary100} />
        <Rect x={72} y={28} width={7} height={18} rx={3.5} fill={c.primaryStrong} />
        <Rect x={121} y={28} width={7} height={18} rx={3.5} fill={c.primaryStrong} />
        <Circle cx={100} cy={99} r={21} fill={c.primary} />
        <Path
          d="M90 99l7 7 13-14"
          stroke={c.white}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path d="M150 124c14-2 22-14 20-27-14 2-22 14-20 27z" fill={c.primary300} />
        <Circle cx={40} cy={60} r={5} fill={c.infoBg} />
        <Path d="M40 84c-4-6-4-10 0-15 4 5 4 9 0 15z" fill={c.info} />
      </G>
    ),
    community: (
      <G>
        <Ellipse cx={100} cy={146} rx={64} ry={8} fill={c.surfaceAlt} />
        <Rect
          x={36}
          y={46}
          width={62}
          height={80}
          rx={10}
          fill={c.primary100}
          transform="rotate(-9 67 86)"
        />
        <Rect
          x={102}
          y={46}
          width={62}
          height={80}
          rx={10}
          fill={c.surfaceAlt}
          transform="rotate(9 133 86)"
        />
        <Rect
          x={66}
          y={36}
          width={68}
          height={90}
          rx={11}
          fill={c.bg}
          stroke={c.border}
          strokeWidth={3}
        />
        <Rect x={73} y={43} width={54} height={54} rx={7} fill={c.primary50} />
        <Path d="M100 88V68" stroke={c.primary} strokeWidth={3.5} strokeLinecap="round" />
        <Path d="M100 76c-9 0-14-6-13-14 9 0 14 6 13 14z" fill={c.primary} />
        <Path d="M100 71c8 0 13-6 12-13-8 0-13 6-12 13z" fill={c.primary300} />
        <Rect x={73} y={104} width={36} height={6} rx={3} fill={c.surfaceAlt} />
        <Rect x={73} y={114} width={24} height={6} rx={3} fill={c.surfaceAlt} />
        <Path
          d="M146 54c-11-7-17-13-17-19 0-5 4-8 8-8 4 0 7 2 9 5 2-3 5-5 9-5 4 0 8 3 8 8 0 6-6 12-17 19z"
          fill={c.danger}
        />
      </G>
    ),
    search: (
      <G>
        <Ellipse cx={100} cy={146} rx={58} ry={8} fill={c.surfaceAlt} />
        <Path d="M56 126c0-42 30-72 72-74 0 44-28 74-72 74z" fill={c.primary100} />
        <Path d="M56 126l50-50" stroke={c.primary300} strokeWidth={3} strokeLinecap="round" />
        <Circle
          cx={112}
          cy={80}
          r={27}
          fill={c.bg}
          opacity={0.75}
          stroke={c.primaryStrong}
          strokeWidth={8}
        />
        <Line
          x1={132}
          y1={100}
          x2={154}
          y2={122}
          stroke={c.primaryStrong}
          strokeWidth={11}
          strokeLinecap="round"
        />
      </G>
    ),
    error: (
      <G>
        <Circle cx={150} cy={44} r={14} fill={c.warningBg} />
        <Rect x={147.5} y={35} width={5} height={12} rx={2.5} fill={c.warning} />
        <Circle cx={150} cy={52} r={2.8} fill={c.warning} />
        <Path
          d="M100 80c0-16 3-25 16-28"
          stroke={c.textDisabled}
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
        />
        <Path d="M116 52c11 3 14 14 9 25-9-4-13-14-9-25z" fill={c.warning} />
        <Path d="M100 66c-12 2-19 10-20 20 11 0 18-8 20-20z" fill={c.primary300} />
        {pot}
      </G>
    ),
    offline: (
      <G>
        <Ellipse cx={100} cy={146} rx={58} ry={8} fill={c.surfaceAlt} />
        <Path
          d="M62 116c-16 0-25-12-23-25 2-12 14-18 24-16 4-17 18-27 37-27 21 0 35 15 37 31 15-2 29 8 29 23 0 8-7 14-15 14z"
          fill={c.surfaceAlt}
          stroke={c.primary300}
          strokeWidth={3}
        />
        <Line
          x1={60}
          y1={40}
          x2={146}
          y2={132}
          stroke={c.textSecondary}
          strokeWidth={6}
          strokeLinecap="round"
        />
      </G>
    ),
    scan: (
      <G>
        <Ellipse cx={100} cy={148} rx={50} ry={7} fill={c.surfaceAlt} />
        <Rect x={64} y={14} width={72} height={130} rx={16} fill={c.textPrimary} />
        <Rect x={70} y={24} width={60} height={110} rx={10} fill={c.primary50} />
        <Path
          d="M80 54v-8a5 5 0 0 1 5-5h8M107 41h8a5 5 0 0 1 5 5v8M120 98v8a5 5 0 0 1-5 5h-8M93 111h-8a5 5 0 0 1-5-5v-8"
          stroke={c.primary}
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
        <Path d="M88 98c0-18 11-30 28-31 0 18-11 31-28 31z" fill={c.primary} />
        <Path d="M88 98l16-16" stroke={c.white} strokeWidth={2.5} strokeLinecap="round" />
        <Rect x={78} y={74} width={44} height={3} rx={1.5} fill={c.primary300} opacity={0.9} />
        <Path d="M154 78c12-2 19-12 17-23-12 2-19 12-17 23z" fill={c.primary300} />
        <Path d="M40 96c-12-2-19-12-17-23 12 2 19 12 17 23z" fill={c.primary100} />
      </G>
    ),
  };

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={width} height={height} viewBox="0 0 200 160">
        {scenes[name]}
      </Svg>
    </View>
  );
}
