import { z } from 'zod';

/**
 * Domain enums. Each is a Zod schema plus its inferred union type, and an
 * `*_VALUES` tuple for iterating in UI (chips, filters, selects).
 */

export const ScanModeSchema = z.enum(['identify', 'diagnose', 'toxicity']);
export type ScanMode = z.infer<typeof ScanModeSchema>;
export const SCAN_MODES = ScanModeSchema.options;

export const SafetyLevelSchema = z.enum(['safe', 'low', 'moderate', 'high', 'severe']);
export type SafetyLevel = z.infer<typeof SafetyLevelSchema>;
export const SAFETY_LEVELS = SafetyLevelSchema.options;

export const UsefulnessTagSchema = z.enum([
  'edible',
  'medicinal',
  'decorative',
  'air_purifying',
  'pollinator_friendly',
  'aromatic',
  'companion',
]);
export type UsefulnessTag = z.infer<typeof UsefulnessTagSchema>;
export const USEFULNESS_TAGS = UsefulnessTagSchema.options;

export const PlantTypeSchema = z.enum([
  'houseplant',
  'tree',
  'shrub',
  'herb',
  'vegetable',
  'fruit',
  'flower',
  'succulent',
  'grass',
  'weed',
  'other',
]);
export type PlantType = z.infer<typeof PlantTypeSchema>;

export const LifecycleSchema = z.enum(['annual', 'biennial', 'perennial', 'unknown']);
export type Lifecycle = z.infer<typeof LifecycleSchema>;

export const GrowthStageSchema = z.enum([
  'seed',
  'sprout',
  'growing',
  'flowering',
  'fruiting',
  'dormant',
]);
export type GrowthStage = z.infer<typeof GrowthStageSchema>;
export const GROWTH_STAGES = GrowthStageSchema.options;

export const PlantedAsSchema = z.enum(['seed', 'seedling', 'cutting', 'bought_plant']);
export type PlantedAs = z.infer<typeof PlantedAsSchema>;

export const CareTaskTypeSchema = z.enum([
  'water',
  'fertilize',
  'mist',
  'prune',
  'rotate',
  'repot',
  'custom',
]);
export type CareTaskType = z.infer<typeof CareTaskTypeSchema>;
export const CARE_TASK_TYPES = CareTaskTypeSchema.options;

export const ExperienceLevelSchema = z.enum(['beginner', 'hobbyist', 'expert']);
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;
export const EXPERIENCE_LEVELS = ExperienceLevelSchema.options;

export const PostCategorySchema = z.enum(['success', 'question', 'harvest', 'problem', 'tip']);
export type PostCategory = z.infer<typeof PostCategorySchema>;

export const JournalTagSchema = z.enum([
  'new_leaf',
  'first_flower',
  'harvest',
  'problem',
  'treatment',
]);
export type JournalTag = z.infer<typeof JournalTagSchema>;

export const DiagnosisSeveritySchema = z.enum(['mild', 'moderate', 'severe']);
export type DiagnosisSeverity = z.infer<typeof DiagnosisSeveritySchema>;
