import { Screen } from '@/components';
import { ComponentGallery } from '@/dev/ComponentGallery';

export default function DevComponentsScreen() {
  return (
    <Screen scroll padded={false} edges={['bottom']}>
      <ComponentGallery />
    </Screen>
  );
}
