import type { ExperienceLevel } from '@leafy/shared';
import { Image } from 'expo-image';
import { Bookmark, Ellipsis, Heart, MessageCircle, Send, Sprout } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Pressable, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/Avatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { compactNumber, splitRichText, timeAgo } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { toImageSource, type ImageLike } from '@/lib/image';
import { createStyles, useTheme } from '@/theme';

export interface PostCardData {
  id: string;
  author: {
    username: string;
    displayName: string;
    avatarUrl?: string | null;
    experience: ExperienceLevel;
  };
  createdAt: Date;
  /** 1–10 photos (URLs from the API, or bundled assets in dev). */
  media: ImageLike[];
  caption: string;
  plant?: { name: string; day: number } | null;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  saved: boolean;
  topComment?: { username: string; text: string } | null;
}

export interface PostCardProps {
  post: PostCardData;
  onToggleLike: (next: boolean) => void;
  onToggleSave: (next: boolean) => void;
  onPressComments?: () => void;
  onPressShare?: () => void;
  onPressMore?: () => void;
  onPressAuthor?: () => void;
  onPressPlant?: () => void;
  onPressHashtag?: (tag: string) => void;
}

const EXPERIENCE_TONE: Record<ExperienceLevel, BadgeTone> = {
  beginner: 'neutral',
  hobbyist: 'info',
  expert: 'success',
};

const CAPTION_COLLAPSE_CHARS = 110;

export function PostCard({
  post,
  onToggleLike,
  onToggleSave,
  onPressComments,
  onPressShare,
  onPressMore,
  onPressAuthor,
  onPressPlant,
  onPressHashtag,
}: PostCardProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const ago = timeAgo(post.createdAt);
  const [expanded, setExpanded] = useState(false);
  const collapsible = post.caption.length > CAPTION_COLLAPSE_CHARS || post.caption.includes('\n');

  const like = (next: boolean) => {
    haptics.medium();
    onToggleLike(next);
  };

  return (
    <View style={s.card}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          style={s.author}
          onPress={onPressAuthor}
          disabled={!onPressAuthor}
          accessibilityRole="button"
          accessibilityLabel={`@${post.author.username}, ${t(`components.experience.${post.author.experience}`)}`}
        >
          <Avatar name={post.author.displayName} uri={post.author.avatarUrl} size="md" />
          <View style={s.authorText}>
            <View style={s.authorRow}>
              <Text variant="h3" numberOfLines={1} style={s.username}>
                @{post.author.username}
              </Text>
              <Badge
                label={t(`components.experience.${post.author.experience}`)}
                tone={EXPERIENCE_TONE[post.author.experience]}
                size="S"
              />
            </View>
            <Text variant="caption" color="textMuted">
              {t(`common.timeAgo.${ago.unit}`, { count: ago.count })}
            </Text>
          </View>
        </Pressable>
        <IconButton
          icon={Ellipsis}
          accessibilityLabel={t('components.post.moreOptions')}
          onPress={onPressMore}
          iconSize={20}
        />
      </View>

      {/* Media */}
      <MediaCarousel
        media={post.media}
        onDoubleTapLike={() => {
          if (!post.liked) like(true);
        }}
      />

      {/* Linked plant */}
      {post.plant ? (
        <Chip
          icon={Sprout}
          label={t('components.post.plantDay', { plant: post.plant.name, day: post.plant.day })}
          size="S"
          selected
          onPress={onPressPlant}
          style={s.plantChip}
        />
      ) : null}

      {/* Actions */}
      <View style={s.actions}>
        <IconButton
          icon={Heart}
          accessibilityLabel={t(post.liked ? 'components.post.unlike' : 'components.post.like')}
          active={post.liked}
          activeColor={theme.colors.danger}
          onPress={() => like(!post.liked)}
          iconSize={24}
        />
        <IconButton
          icon={MessageCircle}
          accessibilityLabel={t('components.post.comment')}
          onPress={onPressComments}
          iconSize={24}
        />
        <IconButton
          icon={Send}
          accessibilityLabel={t('components.post.share')}
          onPress={onPressShare}
          iconSize={22}
        />
        <View style={s.spacer} />
        <IconButton
          icon={Bookmark}
          accessibilityLabel={t(post.saved ? 'components.post.unsave' : 'components.post.save')}
          active={post.saved}
          activeColor={theme.colors.primaryStrong}
          onPress={() => {
            haptics.medium();
            onToggleSave(!post.saved);
          }}
          iconSize={24}
        />
      </View>

      {/* Text */}
      <View style={s.body}>
        <Text variant="body" style={s.likes}>
          {t('components.post.likes', {
            count: post.likesCount,
            formatted: compactNumber(post.likesCount),
          })}
        </Text>
        {post.caption ? (
          <Text variant="body" numberOfLines={expanded || !collapsible ? undefined : 2}>
            <Text variant="body" style={s.bold}>
              {post.author.username}{' '}
            </Text>
            {splitRichText(post.caption).map((seg, i) =>
              seg.type === 'text' ? (
                <Text key={i} variant="body">
                  {seg.value}
                </Text>
              ) : (
                <Text
                  key={i}
                  variant="body"
                  color="primaryStrong"
                  style={s.tag}
                  onPress={
                    seg.type === 'hashtag' && onPressHashtag
                      ? () => onPressHashtag(seg.value)
                      : undefined
                  }
                >
                  {seg.value}
                </Text>
              ),
            )}
          </Text>
        ) : null}
        {collapsible && !expanded ? (
          <Pressable onPress={() => setExpanded(true)} hitSlop={8} accessibilityRole="button">
            <Text variant="bodySmall" color="textSecondary">
              {t('common.actions.more')}
            </Text>
          </Pressable>
        ) : null}
        {post.commentsCount > 0 ? (
          <Pressable onPress={onPressComments} hitSlop={6} accessibilityRole="button">
            <Text variant="bodySmall" color="textSecondary">
              {t('components.post.viewComments', { count: post.commentsCount })}
            </Text>
          </Pressable>
        ) : null}
        {post.topComment ? (
          <Text variant="bodySmall" numberOfLines={1}>
            <Text variant="bodySmall" style={s.bold}>
              {post.topComment.username}{' '}
            </Text>
            {post.topComment.text}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

interface MediaCarouselProps {
  media: ImageLike[];
  onDoubleTapLike: () => void;
}

function MediaCarousel({ media, onDoubleTapLike }: MediaCarouselProps) {
  const theme = useTheme();
  const s = useStyles();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const burst = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({
    opacity: burst.value > 0 ? 1 : 0,
    transform: [{ scale: burst.value }],
  }));

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd((_e, success) => {
      if (!success) return;
      onDoubleTapLike();
      burst.set(
        reduceMotion
          ? withSequence(
              withTiming(1, { duration: 1 }),
              withDelay(500, withTiming(0, { duration: 150 })),
            )
          : withSequence(
              withSpring(1.15, { damping: 9, stiffness: 260 }),
              withSpring(1, { damping: 12 }),
              withDelay(350, withTiming(0, { duration: 200 })),
            ),
      );
    });

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const height = width / theme.layout.postMediaAspect;

  return (
    <View
      style={s.media}
      onLayout={onLayout}
      accessibilityHint={t('components.post.doubleTapHint')}
    >
      {width > 0 ? (
        <GestureDetector gesture={doubleTap}>
          <View>
            <FlatList
              data={media}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, i) => `${item}-${i}`}
              onMomentumScrollEnd={(e) =>
                setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
              }
              renderItem={({ item, index: i }) => (
                <Image
                  source={toImageSource(item)}
                  style={{ width, height }}
                  contentFit="cover"
                  transition={theme.motion.duration.base}
                  accessibilityLabel={t('components.post.photoOf', {
                    index: i + 1,
                    total: media.length,
                  })}
                />
              )}
            />
            <View style={s.heartWrap}>
              <Animated.View style={heartStyle}>
                <Heart
                  size={88}
                  color={theme.colors.white}
                  fill={theme.colors.white}
                  strokeWidth={1.5}
                />
              </Animated.View>
            </View>
          </View>
        </GestureDetector>
      ) : (
        <View style={{ aspectRatio: theme.layout.postMediaAspect }} />
      )}
      {media.length > 1 ? (
        <View
          style={s.dots}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {media.map((m, i) => (
            <View key={`${m}-${i}`} style={[s.dot, i === index ? s.dotActive : null]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  card: { gap: t.spacing[2], paddingBottom: t.spacing[4] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing[2],
    paddingHorizontal: t.layout.screenPaddingX,
  },
  author: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: t.spacing[3] },
  authorText: { flex: 1 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[2] },
  username: { flexShrink: 1, fontSize: 15 },
  media: {
    marginHorizontal: t.layout.screenPaddingX,
    borderRadius: t.radius.md,
    overflow: 'hidden',
    backgroundColor: t.colors.surfaceAlt,
  },
  heartWrap: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: t.spacing[3],
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: t.spacing[2],
    paddingVertical: t.spacing[1],
    borderRadius: t.radius.full,
    backgroundColor: t.colors.cameraScrim,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: t.colors.white, opacity: 0.5 },
  dotActive: { opacity: 1 },
  plantChip: { marginHorizontal: t.layout.screenPaddingX },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.layout.screenPaddingX - 10,
  },
  spacer: { flex: 1 },
  body: { gap: t.spacing[1], paddingHorizontal: t.layout.screenPaddingX },
  likes: { fontFamily: t.fontFamily.semibold },
  bold: { fontFamily: t.fontFamily.semibold },
  tag: { fontFamily: t.fontFamily.medium },
}));
