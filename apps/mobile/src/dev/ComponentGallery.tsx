import {
  EXPERIENCE_LEVELS,
  SAFETY_LEVELS,
  USEFULNESS_TAGS,
  type ExperienceLevel,
} from '@leafy/shared';
import { palette, typography, type TypographyVariant } from '@leafy/ui-tokens';
import { useRouter } from 'expo-router';
import {
  Bell,
  Droplet,
  Heart,
  Home,
  Plus,
  ScanLine,
  Search,
  Share2,
  Sprout,
  Trash2,
  X,
} from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  BottomSheet,
  Button,
  Card,
  CareTaskRow,
  CareTaskRowSkeleton,
  Chip,
  ConfirmDialog,
  DangerMeter,
  DateField,
  Divider,
  EmptyState,
  ErrorState,
  FilterChip,
  IconButton,
  Illustration,
  Logo,
  OfflineBanner,
  PlantCard,
  PlantCardSkeleton,
  PostCard,
  PostCardSkeleton,
  ProgressBar,
  ProgressRing,
  ScanButton,
  SegmentedControl,
  Select,
  Stepper,
  Text,
  TextArea,
  TextField,
  Toggle,
  UsefulnessTags,
  type BadgeTone,
  type BottomSheetRef,
  type IllustrationName,
  type PostCardData,
} from '@/components';
import { toast } from '@/stores/toast';
import { createStyles, useTheme } from '@/theme';

import { DEMO_PLANTS, DEMO_POST } from './mockData';

const TYPE_VARIANTS = Object.keys(typography) as TypographyVariant[];
const BADGE_TONES: BadgeTone[] = ['success', 'warning', 'danger', 'info', 'neutral'];
const ILLUSTRATIONS: IllustrationName[] = [
  'pot',
  'sprout',
  'calendar',
  'community',
  'search',
  'error',
  'offline',
  'scan',
];
const FILTERS = ['all', 'indoor', 'outdoor', 'vegetables', 'herbs'] as const;
const SEGMENTS = ['overview', 'care', 'journal', 'health'] as const;
const SPACES = ['balcony', 'kitchen', 'greenhouse'] as const;

/** Every design-system component in its main states (hidden /dev route). */
export function ComponentGallery() {
  const s = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [filters, setFilters] = useState<Set<string>>(new Set(['all']));
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]>('overview');
  const [nickname, setNickname] = useState('');
  const [notes, setNotes] = useState('');
  const [planted, setPlanted] = useState<Date | null>(new Date());
  const [space, setSpace] = useState<(typeof SPACES)[number] | null>('balcony');
  const [waterEvery, setWaterEvery] = useState(3);
  const [reminders, setReminders] = useState(true);
  const [seasonal, setSeasonal] = useState(false);
  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set(['done']));
  const [post, setPost] = useState<PostCardData>(DEMO_POST);
  const [dialog, setDialog] = useState(false);
  const sheet = useRef<BottomSheetRef>(null);

  const toggleTask = (id: string, done: boolean) =>
    setDoneTasks((prev) => {
      const next = new Set(prev);
      if (done) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <View style={s.root}>
      <Section title={t('dev.sections.typography')}>
        {TYPE_VARIANTS.map((variant) => (
          <View key={variant} style={s.typeRow}>
            <Text variant="caption" color="textMuted" style={s.typeName}>
              {`${variant} ${typography[variant].fontSize}/${typography[variant].lineHeight}`}
            </Text>
            <Text variant={variant} numberOfLines={1}>
              {t('dev.sample.typography')}
            </Text>
          </View>
        ))}
      </Section>

      <Section title={t('dev.sections.colors')}>
        <View style={s.swatches}>
          {(Object.keys(palette) as (keyof typeof palette)[]).map((name) => (
            <View key={name} style={s.swatch}>
              <View style={[s.swatchColor, { backgroundColor: palette[name] }]} />
              <Text variant="caption" numberOfLines={1}>
                {name}
              </Text>
              <Text variant="caption" color="textMuted">
                {palette[name]}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('dev.sections.buttons')}>
        <Button label={t('dev.sample.buttons.primary')} leftIcon={Plus} fullWidth />
        <Button
          label={t('dev.sample.buttons.secondary')}
          leftIcon={Share2}
          variant="secondary"
          fullWidth
        />
        <Button label={t('dev.sample.buttons.ghost')} variant="ghost" fullWidth />
        <Button
          label={t('dev.sample.buttons.destructive')}
          leftIcon={Trash2}
          variant="destructive"
          fullWidth
        />
        <View style={s.row}>
          <Button label={t('dev.sample.buttons.primary')} size="M" />
          <Button label={t('dev.sample.buttons.small')} size="S" variant="secondary" />
        </View>
        <View style={s.row}>
          <Button label={t('dev.sample.buttons.loading')} loading size="M" />
          <Button label={t('dev.sample.buttons.disabled')} disabled size="M" />
        </View>
      </Section>

      <Section title={t('dev.sections.iconButtons')}>
        <View style={s.row}>
          <IconButton icon={Search} accessibilityLabel={t('community.searchA11y')} />
          <IconButton
            icon={Search}
            variant="tinted"
            accessibilityLabel={t('community.searchA11y')}
          />
          <IconButton icon={Plus} variant="filled" accessibilityLabel={t('garden.addA11y')} />
          <IconButton icon={Bell} accessibilityLabel={t('dev.sample.withBadge')} badgeCount={4} />
          <IconButton
            icon={Heart}
            accessibilityLabel={t('dev.sample.activeHeart')}
            active
            activeColor={theme.colors.danger}
          />
          <View style={s.darkTile}>
            <IconButton icon={X} variant="overlay" accessibilityLabel={t('dev.sample.onPhoto')} />
          </View>
        </View>
      </Section>

      <Section title={t('dev.sections.chips')}>
        <View style={s.wrap}>
          <Chip label={t('dev.sample.chip')} icon={Home} />
          <Chip label={t('dev.sample.chipEmoji')} leading="🌱" selected />
          <Chip label={t('components.stage.flowering')} size="S" />
        </View>
        <View style={s.wrap}>
          {FILTERS.map((key) => (
            <FilterChip
              key={key}
              label={t(`dev.sample.filters.${key}`)}
              selected={filters.has(key)}
              onToggle={(on) =>
                setFilters((prev) => {
                  const next = new Set(prev);
                  if (on) next.add(key);
                  else next.delete(key);
                  return next;
                })
              }
            />
          ))}
        </View>
        <View style={s.wrap}>
          {BADGE_TONES.map((tone) => (
            <Badge key={tone} label={t(`dev.sample.badges.${tone}`)} tone={tone} dot />
          ))}
          <Badge label={t('dev.sample.badges.info')} tone="info" icon={Droplet} size="S" />
        </View>
        <View style={s.wrap}>
          {EXPERIENCE_LEVELS.map((lvl: ExperienceLevel) => (
            <Badge key={lvl} label={t(`components.experience.${lvl}`)} size="S" />
          ))}
        </View>
        <View style={s.row}>
          <Avatar name="Maya Green" size="xs" />
          <Avatar name="Maya Green" size="sm" />
          <Avatar name="Leo Plants" size="md" />
          <Avatar name="Fern" size="lg" />
          <Avatar name="Ana Lopez" size="xl" />
        </View>
      </Section>

      <Section title={t('dev.sections.cards')}>
        <Card variant="tinted">
          <Text variant="h3" color="primaryDeep">
            {t('dev.sample.cardTitle')}
          </Text>
          <Text variant="body" color="textSecondary">
            {t('dev.sample.cardBody')}
          </Text>
        </Card>
        <View style={s.grid}>
          {DEMO_PLANTS.map(({ id, ...plant }) => (
            <View key={id} style={s.gridItem}>
              <PlantCard {...plant} onPress={() => router.push(`/plant/${id}`)} />
            </View>
          ))}
        </View>
        {DEMO_PLANTS.slice(0, 2).map(({ id, ...plant }) => (
          <PlantCard
            key={id}
            {...plant}
            variant="list"
            onPress={() => router.push(`/plant/${id}`)}
          />
        ))}
      </Section>

      <Section title={t('dev.sections.inputs')}>
        <TextField
          label={t('dev.sample.nickname')}
          placeholder={t('dev.sample.nicknamePlaceholder')}
          helper={t('dev.sample.nicknameHelper')}
          leftIcon={Sprout}
          value={nickname}
          onChangeText={setNickname}
        />
        <TextField
          label={t('dev.sample.username')}
          value="maya.grows"
          error={t('dev.sample.usernameError')}
          autoCapitalize="none"
        />
        <TextArea
          label={t('dev.sample.notes')}
          placeholder={t('dev.sample.notesPlaceholder')}
          optional
          maxLength={280}
          value={notes}
          onChangeText={setNotes}
        />
        <DateField label={t('dev.sample.plantedOn')} value={planted} onChange={setPlanted} />
        <Select
          label={t('dev.sample.space')}
          value={space}
          onChange={setSpace}
          options={SPACES.map((key) => ({ value: key, label: t(`dev.sample.spaces.${key}`) }))}
        />
      </Section>

      <Section title={t('dev.sections.controls')}>
        <SegmentedControl
          value={segment}
          onChange={setSegment}
          segments={SEGMENTS.map((key) => ({ key, label: t(`dev.sample.segments.${key}`) }))}
        />
        <Stepper
          label={t('dev.sample.waterEvery')}
          value={waterEvery}
          onChange={setWaterEvery}
          min={1}
          max={30}
          formatValue={(n) => t('components.frequency.days', { count: n })}
        />
        <Toggle
          label={t('dev.sample.reminders')}
          description={t('dev.sample.remindersHint')}
          value={reminders}
          onValueChange={setReminders}
        />
        <Toggle label={t('dev.sample.seasonal')} value={seasonal} onValueChange={setSeasonal} />
      </Section>

      <Section title={t('dev.sections.progress')}>
        <View style={s.progressRow}>
          <ProgressRing progress={0.62} accessibilityLabel={t('dev.sample.progressRingA11y')}>
            <Text variant="h3" color="primaryDeep">
              {t('dev.sample.progressRing')}
            </Text>
          </ProgressRing>
          <View style={s.flex}>
            <Text variant="h3">{t('components.stage.flowering')}</Text>
            <Text variant="bodySmall" color="textSecondary">
              {t('dev.sample.growth')}
            </Text>
          </View>
        </View>
        <ProgressBar progress={34 / 60} label={t('dev.sample.growthBar')} />
      </Section>

      <Section title={t('dev.sections.garden')}>
        <CareTaskRow
          taskType="water"
          plantName="Basil"
          subtitle={t('dev.sample.spaces.kitchen')}
          thumbnail={DEMO_PLANTS[2]?.photo}
          due={{ kind: 'today' }}
          done={doneTasks.has('water')}
          onToggleDone={(d) => toggleTask('water', d)}
        />
        <Divider inset={60} />
        <CareTaskRow
          taskType="fertilize"
          plantName="Tommy the Tomato"
          subtitle={t('dev.sample.spaces.balcony')}
          thumbnail={DEMO_PLANTS[0]?.photo}
          due={{ kind: 'overdue', days: 2 }}
          done={doneTasks.has('fertilize')}
          onToggleDone={(d) => toggleTask('fertilize', d)}
        />
        <Divider inset={60} />
        <CareTaskRow
          taskType="mist"
          plantName="Monty"
          thumbnail={DEMO_PLANTS[1]?.photo}
          due={{ kind: 'upcoming', days: 3 }}
          done={doneTasks.has('mist')}
          onToggleDone={(d) => toggleTask('mist', d)}
        />
        <Divider inset={60} />
        <CareTaskRow
          taskType="rotate"
          plantName="Monty"
          due={{ kind: 'upcoming', days: 1 }}
          done={doneTasks.has('done')}
          onToggleDone={(d) => toggleTask('done', d)}
        />
      </Section>

      <Section title={t('dev.sections.safety')}>
        <DangerMeter level="moderate" />
        <Text variant="caption" color="textMuted">
          {t('dev.sample.safetyLevels')}
        </Text>
        {SAFETY_LEVELS.map((level) => (
          <DangerMeter key={level} level={level} size="S" />
        ))}
        <UsefulnessTags tags={USEFULNESS_TAGS} />
      </Section>

      <Section title={t('dev.sections.feed')} flush>
        <PostCard
          post={post}
          onToggleLike={(liked) =>
            setPost((p) => ({ ...p, liked, likesCount: p.likesCount + (liked ? 1 : -1) }))
          }
          onToggleSave={(saved) => setPost((p) => ({ ...p, saved }))}
          onPressPlant={() => router.push('/plant/demo-plant')}
          onPressComments={() => router.push(`/post/${post.id}`)}
        />
      </Section>

      <Section title={t('dev.sections.feedback')}>
        <View style={s.wrap}>
          <Button
            label={t('dev.sample.showToast')}
            size="S"
            variant="secondary"
            onPress={() => toast.success(t('dev.sample.toastSuccess'))}
          />
          <Button
            label={t('dev.sample.showErrorToast')}
            size="S"
            variant="ghost"
            onPress={() => toast.error(t('dev.sample.toastError'))}
          />
          <Button
            label={t('dev.sample.showInfoToast')}
            size="S"
            variant="ghost"
            onPress={() => toast.show(t('dev.sample.toastInfo'))}
          />
        </View>
        <View style={s.wrap}>
          <Button
            label={t('dev.sample.openDialog')}
            size="S"
            variant="secondary"
            onPress={() => setDialog(true)}
          />
          <Button
            label={t('dev.sample.openSheet')}
            size="S"
            variant="secondary"
            onPress={() => sheet.current?.present()}
          />
        </View>
        <Text variant="caption" color="textMuted">
          {t('dev.sample.offlineBanner')}
        </Text>
        <OfflineBanner />
      </Section>

      <Section title={t('dev.sections.states')}>
        <Card variant="outlined" padding={0}>
          <EmptyState
            compact
            illustration="pot"
            title={t('garden.emptyTitle')}
            body={t('garden.emptyBody')}
            primaryAction={{
              label: t('garden.scanCta'),
              icon: ScanLine,
              onPress: () => router.push('/scan'),
            }}
          />
        </Card>
        <Card variant="outlined" padding={0}>
          <ErrorState compact onRetry={() => toast.show(t('common.actions.retry'))} />
        </Card>
        <Text variant="caption" color="textMuted">
          {t('dev.sample.loadingSkeletons')}
        </Text>
        <View style={s.grid}>
          <View style={s.gridItem}>
            <PlantCardSkeleton />
          </View>
          <View style={s.gridItem}>
            <PlantCardSkeleton />
          </View>
        </View>
        <CareTaskRowSkeleton />
        <PostCardSkeleton />
      </Section>

      <Section title={t('dev.sections.illustrations')}>
        <View style={s.wrap}>
          {ILLUSTRATIONS.map((name) => (
            <View key={name} style={s.illustration}>
              <Illustration name={name} width={140} />
              <Text variant="caption" color="textMuted" align="center">
                {name}
              </Text>
            </View>
          ))}
        </View>
        <Text variant="caption" color="textMuted">
          {t('dev.sample.logo')}
        </Text>
        <View style={s.logoRow}>
          <Logo size={64} />
          <Logo size={40} color={theme.colors.primaryStrong} />
          <ScanButton onPress={() => router.push('/scan')} />
        </View>
      </Section>

      <ConfirmDialog
        visible={dialog}
        title={t('dev.sample.dialogTitle')}
        message={t('dev.sample.dialogBody')}
        confirmLabel={t('common.actions.delete')}
        destructive
        onConfirm={() => setDialog(false)}
        onCancel={() => setDialog(false)}
      />
      <BottomSheet ref={sheet} title={t('dev.sample.sheetTitle')}>
        <Text variant="body" color="textSecondary">
          {t('dev.sample.sheetBody')}
        </Text>
        <Button
          label={t('common.actions.done')}
          fullWidth
          onPress={() => sheet.current?.dismiss()}
        />
      </BottomSheet>
    </View>
  );
}

function Section({
  title,
  children,
  flush,
}: {
  title: string;
  children: ReactNode;
  flush?: boolean;
}) {
  const s = useStyles();
  return (
    <View style={s.section}>
      <Text variant="h2" style={s.sectionTitle}>
        {title}
      </Text>
      <View style={[s.sectionBody, flush ? s.flush : null]}>{children}</View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: { paddingBottom: t.spacing[12] },
  section: { paddingTop: t.spacing[8], gap: t.spacing[4] },
  sectionTitle: { paddingHorizontal: t.layout.screenPaddingX },
  sectionBody: { paddingHorizontal: t.layout.screenPaddingX, gap: t.spacing[4] },
  flush: { paddingHorizontal: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[3], flexWrap: 'wrap' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[2] },
  flex: { flex: 1, gap: t.spacing[1] },
  typeRow: { gap: 2 },
  typeName: { fontFamily: t.fontFamily.regular },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[3] },
  swatch: { width: 96, gap: 2 },
  swatchColor: {
    height: 48,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.colors.border,
    marginBottom: t.spacing[1],
  },
  darkTile: {
    padding: t.spacing[1],
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.textPrimary,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing[4] },
  gridItem: { width: '47%', flexGrow: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[4] },
  illustration: { width: 140, gap: t.spacing[1] },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing[6] },
}));
