import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';
import { useCallback, type ReactNode, type Ref } from 'react';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { createStyles, useTheme } from '@/theme';

import { IconButton } from './IconButton';
import { Text } from './Text';

export type BottomSheetRef = BottomSheetModal;

export interface BottomSheetProps {
  ref?: Ref<BottomSheetModal>;
  title?: string;
  children: ReactNode;
  /** Fixed snap points; omit to size the sheet to its content. */
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
}

/**
 * Token-styled wrapper around @gorhom/bottom-sheet's modal sheet.
 * Open with `ref.current?.present()`, close with `ref.current?.dismiss()`.
 */
export function BottomSheet({ ref, title, children, snapPoints, onDismiss }: BottomSheetProps) {
  const theme = useTheme();
  const s = useStyles();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={1}
        style={[props.style, { backgroundColor: theme.colors.overlay }]}
      />
    ),
    [theme],
  );

  const dismiss = () => {
    if (ref && typeof ref === 'object') ref.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={s.background}
      handleIndicatorStyle={s.handle}
      animateOnMount={!reduceMotion}
      accessibilityViewIsModal
    >
      <BottomSheetScrollView
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + theme.spacing[6] }]}
      >
        {title ? (
          <View style={s.header}>
            <Text variant="h2" style={s.title}>
              {title}
            </Text>
            <IconButton
              icon={X}
              variant="tinted"
              size={36}
              iconSize={18}
              accessibilityLabel={t('common.actions.close')}
              onPress={dismiss}
            />
          </View>
        ) : null}
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const useStyles = createStyles((t) => ({
  background: {
    backgroundColor: t.colors.bg,
    borderTopLeftRadius: t.radius.lg,
    borderTopRightRadius: t.radius.lg,
  },
  handle: { backgroundColor: t.colors.border, width: 40, height: 5 },
  content: { paddingHorizontal: t.layout.screenPaddingX, gap: t.spacing[4] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.spacing[3],
    paddingTop: t.spacing[1],
  },
  title: { flex: 1 },
}));
